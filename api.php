<?php
define("FILE_PUT_CONTENTS_ATOMIC_TEMP", dirname(__FILE__)."/cache"); 
define("FILE_PUT_CONTENTS_ATOMIC_MODE", 0777); 


function file_put_contents_atomic($filename, $content) { 
   
    $temp = tempnam(FILE_PUT_CONTENTS_ATOMIC_TEMP, 'temp'); 
    if (!($f = @fopen($temp, 'wb'))) { 
        $temp = FILE_PUT_CONTENTS_ATOMIC_TEMP . DIRECTORY_SEPARATOR . uniqid('temp'); 
        if (!($f = @fopen($temp, 'wb'))) { 
            trigger_error("file_put_contents_atomic() : error writing temporary file '$temp'", E_USER_WARNING); 
            return false; 
        } 
    } 
   
    fwrite($f, $content); 
    fclose($f); 
   
    if (!@rename($temp, $filename)) { 
        @unlink($filename); 
        @rename($temp, $filename); 
    } 
   
    @chmod($filename, FILE_PUT_CONTENTS_ATOMIC_MODE); 
   
    return true; 
   
} 



  
$type = $_GET['a'];

if(isset($type)) {
	
	if ($type == 'read') {
		$data = file_get_contents('items.json');
		print_r($data);		
	} else if ($type == 'update') {
		$data = json_decode(file_get_contents('php://input'));
		//if() {
			//file_put_contents_atomic('items.json', json_encode($data));
			 $f = @fopen('items.json', 'w');
	        if (!$f) {
	            print_r('not updated');
	        } else {
	            $bytes = fwrite($f, json_encode($data));
	            fclose($f);
	            print_r('updated');
	        }
			
				
		//}
			
	}
		
} else {
	'Access Denied';
}



