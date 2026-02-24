<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request");
}

// ======================
// LOAD PHPMailer
// ======================
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'assets/PHPMailer.php';
require 'assets/SMTP.php';
require 'assets/Exception.php';

// ======================
// Detect form type properly
// ======================
$isContactForm = isset($_POST['description']);
$isJobForm     = isset($_POST['experience']) || isset($_POST['cv_link']) || isset($_POST['position']);
$isMessageForm = isset($_POST['message']) && !$isContactForm && !$isJobForm;

$to = "janavalsan@mindstory.in";

// ======================
// FORM 1 – CONTACT FORM
// ======================
if ($isContactForm) {

    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $description = htmlspecialchars(trim($_POST['description'] ?? ''));

    if (!$name || !$email) {
        die("Required fields missing");
    }

    $subject = "New Contact Form Submission";

    $message = buildEmailTemplate(
        "New Contact Form Submission",
        [
            "Name" => $name,
            "Email" => "<a href='mailto:$email'>$email</a>",
            "Phone" => $phone,
            "Message" => nl2br($description)
        ],
        "This email was generated from your website contact form."
    );
}

// ======================
// FORM 3 – JOB APPLICATION
// ======================
elseif ($isJobForm) {

    $position   = htmlspecialchars(trim($_POST['position'] ?? ''));
    $name       = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email      = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone      = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $experience = htmlspecialchars(trim($_POST['experience'] ?? ''));
    $portfolio  = htmlspecialchars(trim($_POST['portfolio'] ?? ''));
    $cv_link    = htmlspecialchars(trim($_POST['cv_link'] ?? ''));
    $messageText= htmlspecialchars(trim($_POST['message'] ?? ''));

    if (!$name || !$email || !$phone || !$experience || !$messageText) {
        die("Missing required fields");
    }

    if ($portfolio && !filter_var($portfolio, FILTER_VALIDATE_URL)) {
        die("Invalid Portfolio URL");
    }

    if ($cv_link && !filter_var($cv_link, FILTER_VALIDATE_URL)) {
        die("Invalid CV Link URL");
    }

    $subject = "New Job Application" . ($position ? " - $position" : "");

    $message = buildEmailTemplate(
        "New Job Application",
        [
            "Position" => $position ?: "-",
            "Name" => $name,
            "Email" => "<a href='mailto:$email'>$email</a>",
            "Phone" => $phone,
            "Experience" => $experience,
            "Portfolio/LinkedIn" => $portfolio ? "<a href='$portfolio' target='_blank'>$portfolio</a>" : "-",
            "CV Link" => $cv_link ? "<a href='$cv_link' target='_blank'>$cv_link</a>" : "-",
            "Why Interested?" => nl2br($messageText)
        ],
        "This email was generated from your website job application form."
    );
}

// ======================
// FORM 2 – SIMPLE MESSAGE FORM
// ======================
elseif ($isMessageForm) {

    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $website = htmlspecialchars(trim($_POST['website'] ?? ''));
    $messageText = htmlspecialchars(trim($_POST['message'] ?? ''));

    if (!$name || !$email || !$messageText) {
        die("Missing required fields");
    }

    $subject = "New Contact Form Submission";

    $message = buildEmailTemplate(
        "New Contact Form Submission",
        [
            "Name" => $name,
            "Email" => "<a href='mailto:$email'>$email</a>",
            "Website" => $website ?: "-",
            "Message" => nl2br($messageText)
        ],
        "This email was generated from your website contact form."
    );
}

else {
    die("Unknown form type");
}


// ======================
// SEND EMAIL (GMAIL SMTP)
// ======================
$mail = new PHPMailer(true);

try {

    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'viralcatmailer@gmail.com';
    $mail->Password   = 'mjgrzsoyluvyiewk';   // ⚠️ Move to config file in production
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('viralcatmailer@gmail.com', 'Viral Cat Agency Website');
    $mail->addAddress($to);

    // $mail->addCC('lijoy@mindstory.in');
    // $mail->addCC('lijoymindstory@gmail.com');

    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $message;

    $mail->send();

    echo "<div style='color:green;font-weight:600;'>The form was submitted successfully.</div>";

} catch (Exception $e) {
    echo "<div style='color:red;font-weight:600;'>Mailer Error: {$mail->ErrorInfo}</div>";
}

exit;


// ======================
// REUSABLE EMAIL TEMPLATE FUNCTION
// ======================
function buildEmailTemplate($title, $fields, $footerText)
{
    $rows = '';
    foreach ($fields as $label => $value) {
        $rows .= "
        <tr>
            <td style='border-bottom:1px solid #eee;font-weight:bold;width:35%;padding:10px;'>$label</td>
            <td style='border-bottom:1px solid #eee;padding:10px;'>$value</td>
        </tr>";
    }

    return "
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;'>
      <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f6f8;padding:40px 0;'>
        <tr>
          <td align='center'>
            <table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:10px;overflow:hidden;'>

              <tr>
                <td style='background:#6f3374;color:#ffffff;padding:25px;text-align:center;'>
                  <h2 style='margin:0;font-weight:600;'>$title</h2>
                </td>
              </tr>

              <tr>
                <td style='padding:30px;'>
                  <p style='margin-top:0;color:#555;font-size:14px;'>
                    Someone submitted a form on viralcatmeow.com. Here are the details:
                  </p>

                  <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse;margin-top:20px;'>
                    $rows
                  </table>
                </td>
              </tr>

              <tr>
                <td style='background:#f9fafb;padding:18px;text-align:center;font-size:12px;color:#888;'>
                  $footerText
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>";
}
?>