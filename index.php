<?php
	/**
	 * Created by PhpStorm.
	 * User: Julien
	 * Date: 31/07/2017
	 * Time: 11:44
	 */
	ini_set('display_errors', 1);
	ini_set('error_reporting', E_ALL);

	function getDirContents($dir, $filter = '', &$results = array()) {
		$files = scandir($dir);

		foreach($files as $key => $value){
			$path = realpath($dir.DIRECTORY_SEPARATOR.$value);

			if(!is_dir($path)) {
				if(empty($filter) || preg_match($filter, $path)) $results[] = $path;
			} elseif($value != "." && $value != "..") {
				getDirContents($path, $filter, $results);
			}
		}

		return $results;
	}

	$relativePathGetted = isset($_GET['scorm_seq_file']) ? '../courses/'.substr($_GET['scorm_seq_file'], strlen(getcwd())+1) : '';

	$allHtmlFiles = getDirContents('../courses', '/\.html$/');
	//$allHtmlFiles = array_merge($allHtmlFiles, getDirContents('SPIAC2017', '/\.html$/'));
	$scormList = "";
	foreach($allHtmlFiles as $val)
		$scormList .= '<option value="'.$val.'" '.((isset($_GET['scorm_seq_file']) && $val==$_GET['scorm_seq_file']) ? 'selected' : '').'>'.$val.'</option>';

	$indexTpl = file_get_contents('index.html');
	$output = str_replace('{{scorm_list}}', $scormList, $indexTpl);
	$output = str_replace('{{scorm_seq_file}}', $relativePathGetted, $output);

	echo $output;
	?>
