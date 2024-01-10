<?php
function writeToLog($data, $title = '') {
	$log = "\n------------------------\n";
	$log .= date("Y.m.d G:i:s") . "\n";
	$log .= (strlen($title) > 0 ? $title : 'DEBUG') . "\n";
	$log .= print_r($data, 1);
	$log .= "\n------------------------\n";
	file_put_contents(getcwd() . '/hook.log', $log, FILE_APPEND);
	return true;
}

// идем в CRM в раздел "Разработчикам" -> "Другое". Создаем входящий вебхук.
// в качестве метода указываем "crm.deal.add"
// настройка прав - указываем "CRM (crm)"
$queryUrl = 'https://portal.bitrix24.ru/rest/43/ut3hgnw8v3hc349nz4ls31/crm.lead.add.json'; // сюда указываем полученный URL
$queryData = http_build_query(array(
	'fields' => array(
		"TITLE" => 'Заявка на аренду:' .' '. $_POST['productName'] .' '. $_POST['productSize'] .': '.  $_POST['productPrice'],
		"NAME" => '',
		"LAST_NAME" => '',
		"STATUS_ID" => "NEW",
		"OPENED" => "Y",
		"UTM_SOURCE" => $_POST['productUtm'],
		"ASSIGNED_BY_ID" => 75, // ID ответственного за лид
		"PHONE" => Array(
	        "n0" => Array(
	            "VALUE" => $_POST['phone'],
	            "VALUE_TYPE" => "WORK",
	        ),
	    ),
		"EMAIL" => Array(
	        "n0" => Array(
	            "VALUE" => $_REQUEST['email'],
	            "VALUE_TYPE" => "WORK",
	        ),
	    ),
		"UF_CRM_1519071700" => 'my-site.com - Заявка', //кастомное поле в CRM, у вас его может и не быть. Нужно для Дополнительной информации, например с какого сайта пришла заявка
	),
	'params' => array("REGISTER_SONET_EVENT" => "Y")
));
$curl = curl_init();
curl_setopt_array($curl, array(
	CURLOPT_SSL_VERIFYPEER => 0,
	CURLOPT_POST => 1,
	CURLOPT_HEADER => 0,
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_URL => $queryUrl,
	CURLOPT_POSTFIELDS => $queryData,
));

$result = curl_exec($curl);
curl_close($curl);

$result = json_decode($result, 1);
writeToLog($result, 'webform result');

if (array_key_exists('error', $result)) echo "Ошибка при сохранении лида: ".$result['error_description']."<br/>";
?>