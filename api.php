<?php

$type = $_GET['a'];

if(isset($type)) {
	
	if ($type == 'read') {
		$data = file_get_contents('items.json');
		print_r($data);		
	} else if ($type == 'update') {
		$data = json_decode(file_get_contents('php://input'));
		//file_put_contents('items.json', json_encode($data));
		$f = @fopen('items.json', 'w');
        if (!$f) {
            print_r('not updated');
        } else {
            $bytes = fwrite($f, json_encode($data));
            fclose($f);
            print_r('updated');
        }
			
	}
		
} else {
	'Access Denied';
}



