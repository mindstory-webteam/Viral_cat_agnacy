<?php
// Set response header to JSON
header('Content-Type: application/json; charset=UTF-8');

// Allow POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// Parse input from POST or JSON raw input
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);
$data = is_array($jsonData) ? $jsonData : $_POST;

if (empty($data) && !empty($rawInput)) {
    parse_str($rawInput, $data);
}

// Extract form data with extensive fallbacks
$name        = trim($data['Potential_Name'] ?? $data['Potential Name'] ?? $data['PotentialName'] ?? $data['name'] ?? $data['full_name'] ?? '');
$company     = trim($data['Accounts_Account_Name'] ?? $data['Accounts.Account Name'] ?? $data['Accounts_AccountName'] ?? $data['company'] ?? $data['brand'] ?? '');
$phone       = trim($data['Contacts_Mobile'] ?? $data['Contacts.Mobile'] ?? $data['Contacts_Mobile'] ?? $data['phone'] ?? $data['mobile'] ?? '');
$email       = trim($data['Contacts_Email'] ?? $data['Contacts.Email'] ?? $data['email'] ?? '');
$service     = trim($data['POTENTIALCF1'] ?? $data['service'] ?? '');
$budget      = trim($data['POTENTIALCF3'] ?? $data['budget'] ?? '');
$timeline    = trim($data['POTENTIALCF2'] ?? $data['timeline'] ?? '');
$description = trim($data['Description'] ?? $data['description'] ?? $data['message'] ?? '');

$pageUrl     = trim($data['POTENTIALCF4'] ?? $data['page_url'] ?? $_SERVER['HTTP_REFERER'] ?? 'https://viralcatmeow.com/enquiry.html');
$utmSource   = trim($data['POTENTIALCF5'] ?? $data['utm_source'] ?? '');
$utmCampaign = trim($data['POTENTIALCF7'] ?? $data['utm_campaign'] ?? '');
$utmContent  = trim($data['POTENTIALCF6'] ?? $data['utm_content'] ?? '');

// Basic validation for required fields
if (empty($name) || empty($company) || empty($phone) || empty($email)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields',
        'received' => array_keys($data)
    ]);
    exit;
}

// Build payload for Zoho Bigin
$biginPayload = [
    'xnQsjsdp'              => 'df6019184df08796c1a91db16e478b0a14cff22218603a5d981eba7ee175b28d',
    'zc_gad'                => '',
    'xmIwtLD'               => '235b3502e9e4ee06e0fc8c4f84bd0ac1c0b2ba25833a02a3deead44c1f7830f9eb7d7342f0047ac74ca078e300307e4d',
    'actionType'            => 'UG90ZW50aWFscw==',
    'returnURL'             => $pageUrl,
    'POTENTIALCF4'          => $pageUrl,
    'POTENTIALCF5'          => $utmSource,
    'POTENTIALCF7'          => $utmCampaign,
    'POTENTIALCF6'          => $utmContent,
    'Pipeline'              => 'Sales Pipeline Standard 1',
    'Stage'                 => 'Qualification',
    'Lead Source'           => 'Official Website',
    'Potential Name'        => $name,
    'Accounts.Account Name' => $company,
    'Contacts.Mobile'       => $phone,
    'Contacts.Email'        => $email,
    'POTENTIALCF1'          => ($service !== '-None-') ? $service : '',
    'POTENTIALCF3'          => ($budget !== '-None-') ? $budget : '',
    'POTENTIALCF2'          => ($timeline !== '-None-') ? $timeline : '',
    'Description'           => $description
];

// Send to Zoho Bigin via cURL
$ch = curl_init('https://bigin.zoho.in/crm/WebToContactForm');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($biginPayload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
curl_setopt($ch, CURLOPT_REFERER, $pageUrl);

$biginResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Log submission status
$logEntry = date('Y-m-d H:i:s')
    . " | Name: $name | Email: $email | Phone: $phone"
    . " | HTTP: $httpCode | cURL Error: $curlError"
    . " | Response: " . substr(trim((string)$biginResponse), 0, 500) . "\n";
@file_put_contents(__DIR__ . '/bigin_submissions.log', $logEntry, FILE_APPEND);

if (($httpCode === 200 || $httpCode === 302) && stripos((string)$biginResponse, 'error') === false) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Lead successfully submitted to Bigin CRM'
    ]);
} else {
    http_response_code(502);
    echo json_encode([
        'status' => 'error',
        'message' => 'Bigin submission failed',
        'debug_code' => $httpCode
    ]);
}
?>
