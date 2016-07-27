<?php require_once('config.php');
class MySQLDatabase {
	private $connection;
	private $magic_quotes_active;
	private $real_escape_string_exists;
		
function __construct() {
		$this->open_connection();
		$this->magic_quotes_active = get_magic_quotes_gpc();
		$this->real_escape_string_exists = function_exists("mysql_real_escape_string"); 
}

public function open_connection() {
	$this->connection = mysql_connect(DB_SERVER, DB_USER, DB_PASS);
		if(!$this->connection) {
			die("Database connection failed: ". mysql_error());
		} else {
			$db_select = mysql_select_db(DB_NAME, $this->connection);
			if(!$db_select) {
			die("Database selection failed: ". mysql_error());
						}	
			}
	}

		public function escape_value($value) {
		if($this->real_escape_string_exists) { 
				if($this->magic_quotes_active) {$value = stripslashes($value);}
				$value = mysql_real_escape_string($value);
				} else {
					if(!$this->magic_quotes_active) { 
					$value = addslashes($value);
										}
					}
				return $value;
			
	}
	
	public function query($sql) {
		$result = mysql_query($sql, $this->connection);
		$this->confirm_query($result);
		return $result;
	}
	
	public function num_rows($result_set) {
		return mysql_num_rows($result_set);
	}
	
	private function confirm_query($result) {
		if (!$result) { 
			die("Database query failed: ". mysql_error());					}
	}
	
	public function insert_id($result_set) {
		//get last id inserted over the current db connection
		return mysql_insert_id($this->connection);
	}
	
	public function fetch_array($result_set) {
		return mysql_fetch_array($result_set);
	}
	
	public function insert_col($query) {
		$result = mysql_query($query, $this->connection);
		$this->confirm_query($result);
		return $result;
	}
	
	public function redirect_to($location = NULL) {
		if ($location) {
			$host  = $_SERVER['HTTP_HOST'];
			$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
			$extra = "{$location}";
			header("Location: http://$host$uri/$extra");
			//header("Location: {$location}");
			exit;
		}
	}
	
	public function session_value($id) {
		if ($id) {
			if(isset($_SESSION[''.$id.''])){
				 	 $my_session_id = $_SESSION[''.$id.''];
					 }
		}
		echo $my_session_id;
	}
	
	public function session_or_db($i, $db_pool) {
	$my_session_id = (isset($_SESSION[''.$i.''])) ? $_SESSION[''.$i.''] : $db_pool[''.$i.''];
		return $my_session_id;
	}
	
	public function do_reg($text, $regex){
	if (preg_match($regex, $text)) {return TRUE;}
	else {return FALSE;}
	}
	public function select_encrypt_query($e, $f, $d) {
	//print_r($e);
			if(!empty($e)) {
				foreach($e as $key => $value):
				foreach($value as $k => $v):
				$insert_fields[] = "AES_DECRYPT({$key}.{$k},'".SALT."') AS {$v}";
				endforeach;
				endforeach;
					  }
			if(!empty($f)) {
				foreach($f as $key => $value):
				foreach($value as $k => $v):
				$insert_fields[] = (is_string($k)) ? "{$key}.{$v} AS {$k}" : "{$key}.{$v}";
				//$insert_fields[] = "{$key}.{$v}";
				endforeach;
				endforeach;
						  }
			if(!empty($d)) {
				foreach($d as $key => $value):
				foreach($value as $k => $v):
				$insert_fields[] = "date_format({$key}.{$k}, '{$v}') as {$k}";
				endforeach;
				endforeach;
						  }
		$insert_string = "".implode(', ', $insert_fields)."";
		return $insert_string;
	  }

	public function insert_encrypt_query($e, $f, $d) {
			if(!empty($e)) {
				foreach($e as $key => $value):
				$fields[] = $key;
				$insert_fields[] = "AES_ENCRYPT('$value','".SALT."')";
				endforeach;
					  }
			if(!empty($f)) {
				foreach($f as $key => $value):
				$fields[] = $key;
				$insert_fields[] = "'".$value."'";
				endforeach;
						  }
			if(!empty($d)) {
				foreach($d as $key => $value):
				$fields[] = $key;
				$insert_fields[] = "".$value."";
				endforeach;
						  }
		$insert_string = "(".implode(', ', $fields).") VALUES (".implode(', ', $insert_fields).")";
		empty($insert_fields);
		return $insert_string;
	  }
	  
	  public function update_encrypt_query($e, $f, $d) {
		if(!empty($e)) {
			foreach($e as $key => $value):
			$update_fields[] = "{$key} = AES_ENCRYPT('$value','".SALT."')";
			endforeach;
				  }
		if(!empty($f)) {
			foreach($f as $key => $value):
			$update_fields[] = "{$key} = '".$value."'";
			endforeach;
					  }
		if(!empty($d)) {
			foreach($d as $key => $value):
			$update_fields[] = "{$key} = ".$value."";
			endforeach;
					  }
		$update_string = "SET ".implode(', ', $update_fields)."";
		empty($update_fields);
		return $update_string;
	  }
	  
	public function findUrl($url) {
$url = str_replace("%20", "CHRUR", $url);
$url = str_replace("%E2%80%99", "CHRR2", $url);
$url = str_replace("-", "CHRRR", $url);
$url = ereg_replace("(www+([.]?[a-zA-Z0-9_/~#=&\?])*)|(http://+([.]?[a-zA-Z0-9_/~#=&\?])*)", "<a href=\"http://\\0\" target=_blank>\\0</a>", $url);
$url = str_replace("CHRR2", "'", $url);
$url = str_replace("CHRRR", "-", $url);
$url = str_replace("CHRUR", " ", $url);
$url = str_replace("http://http://", "http://", $url);
return $url;
	}
	
	
	public function moreInfo($url) {
$url = str_replace("%20", "CHRUR", $url);
$url = str_replace("%E2%80%99", "CHRR2", $url);
$url = str_replace("-", "CHRRR", $url);
$url = ereg_replace("(www+([.]?[a-zA-Z0-9_/~#=&\?])*)|(http://+([.]?[a-zA-Z0-9_/~#=&\?])*)", "<a href=\"http://\\0\" target=_blank>More Information</a>", $url);
$url = str_replace("CHRR2", "'", $url);
$url = str_replace("CHRRR", "-", $url);
$url = str_replace("CHRUR", " ", $url);
$url = str_replace("http://http://", "http://", $url);
return $url;
	}
	
	public function makePin($lenth =5) {
    // makes a random alpha numeric string of a given lenth
    $aZ09 = array_merge(range('A', 'Z'), range(0, 9));
    $out ='';
    for($c=0;$c < $lenth;$c++) {
       $out .= $aZ09[mt_rand(0,count($aZ09)-1)];
    }
    return $out;
}
	
	public function mynl2br($text){
		$order   = array("\r\n", "\n", "\r");
		//$replace = '<br />';
		$replace = ' ';
		// Processes \r\n's first so they aren't converted twice.
		$newstr = str_replace($order, $replace, $text);
		return $newstr;
	}

 public function shorten_text($text, $chars) {
	$str_length = strlen($text);
	if($str_length > $chars) {
	list($short) = explode("\n",wordwrap($text, $chars));
	$text = $short."...";
	}
	return $text;
 }


	public function isValidURL($url) {
		$new_link = preg_match('|^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$|i', $url);
		$new_link = ($new_link) ? $url : "http://".$url;
		return $new_link;
}
 	
	public function highlightSearch($str, $text){
	$section = preg_replace("|($str)|Ui" , '<span class="highlight_word">\1</span>', $text);
	return $section;
	}
public function word_annihilator($text = '') {
$chars = array(
		'“'=>'"',
		'”'=>'"',
		'’'=>'\'',	
		'‘'=>'\'',	
		'—'=>'\' ',
		'•'=>'&raquo;',
		'Ã‚Â£'=>'&pound;',
		174=>'(R)'	  // Registered Trademark
	);
	/*$chars = array(
		130=>',',     // baseline single quote
		131=>'NLG',   // florin
		132=>'"', 	  // baseline double quote
		133=>'...',   // ellipsis
		134=>'**',	  // dagger (a second footnote)
		135=>'***',	  // double dagger (a third footnote)
		136=>'^', 	  // circumflex accent
		137=>'o/oo',  // permile
		138=>'Sh',	  // S Hacek
		139=>'<',	  // left single guillemet
		140=>'OE',	  // OE ligature
		145=>'\'',	  // left single quote
		146=>'\'',	  // right single quote
		147=>'"',	  // left double quote
		148=>'"',	  // right double quote
		149=>'-',	  // bullet
		150=>'-',	  // endash
		151=>'--',	  // emdash
		152=>'~',	  // tilde accent
		153=>'(TM)',  // trademark ligature
		154=>'sh',	  // s Hacek
		155=>'>',	  // right single guillemet
		156=>'oe',	  // oe ligature
		159=>'Y',	  // Y Dieresis
		169=>'(C)',	  // Copyright
		174=>'(R)'	  // Registered Trademark
	);*/
	
	foreach ($chars as $chr=>$replace) {
		$text = str_replace($chr, $replace, $text);
	}
      //$pattern = array( '/(� )|( �)|(_ )|( _)/' , '/_/' ,'/_/' , "#&\#8201;#si" );
      //$replace = array( '"' ,'\'' ,'...' , "&nbsp;" );
	  //$text = preg_replace( $pattern , $replace , $text );
	  
      return $text;
      }
	  
public function strict_knum($k) {
			$k_num = strtoupper($k);
			$k_contain = strpos($k_num, 'U');
			$k_num = preg_replace("/[^0-9,.]/", "", $k_num);
			$k_extra = ($k_contain) ? 'U' : '';
			$k_num = ($k_num) ? "K{$k_extra}".$k_num : '';
			return $k_num;
  }
	

 public function randomFooter() {
$randomFooterArray = array("Oh sweet, thanks for using the system developed by", "Ahoy, smartly done by", "Made with tears, love and sweat by","Un-happy thoughts and peanuts are loved by the", "Kinky boots kick a... in our office!", "Developed by", "Coded and designed by");
return $randomFooterArray[array_rand($randomFooterArray)];
}

public function safehtml($s) {
$wedontlike = array("!", "@", "$", "%", "&", "(", ")", "+", "{", "}", "[", "]", "\\", "'", "\"", "<", ">", ",", "?", "~", "|", "=", "*", "#", "�", ":", ";", "`", "-");
$s=str_replace($wedontlike, "", $s);
$s=str_replace(" ", "_", $s);
return $s;
}}
$db = new MySQLDatabase();
session_start();
?>