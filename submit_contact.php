<?php
/**
 * submit_contact.php — Sky Bridge Technologies Contact Form Backend

 *   - Sends submissions to 10308493@upsamail.edu.gh
 *   - Saves backup to log file
 *   - Works on laptop + phone
 *
 * PHP 7.4+ required.
 */

declare(strict_types=1);

// ============================================================
// CONFIGURATION
// ============================================================
define('CONTACT_PAGE_URL', 'http://192.168.1.166/sky-bridge-technologies/contact.html');
define('TARGET_EMAIL', '10308493@upsamail.edu.gh');
define('LOG_FILE', __DIR__ . '/contact_submissions.log');


// ============================================================
// HELPER: Redirect with feedback
// ============================================================
function redirect(string $status, string $message): void
{
    $params = http_build_query(['status' => $status, 'message' => $message]);
    header('Location: ' . CONTACT_PAGE_URL . '?' . $params);
    exit;
}


// ============================================================
// STEP 1: Block non-POST requests
// ============================================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . CONTACT_PAGE_URL);
    exit;
}


// ============================================================
// STEP 2: Sanitize fields
// ============================================================
function sanitize_text(string $value): string
{
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$full_name = sanitize_text($_POST['full-name'] ?? '');
$email = filter_var(trim($_POST['email-address'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone = sanitize_text($_POST['phone-number'] ?? '');
$subject_key = sanitize_text($_POST['subject'] ?? '');
$message = sanitize_text($_POST['message'] ?? '');

$subject_labels = [
    'general' => 'General Enquiry',
    'quote' => 'Services Quote',
    'support' => 'Support Request',
    'partnership' => 'Partnership Opportunity'
];
$subject_label = $subject_labels[$subject_key] ?? '';


// ============================================================
// STEP 3: Validate fields
// ============================================================
$errors = [];
if (strlen($full_name) < 2)
    $errors[] = 'Full name min 2 chars.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $errors[] = 'Valid email required.';
if (empty($subject_label))
    $errors[] = 'Select a subject.';
if (strlen($message) < 10)
    $errors[] = 'Message min 10 chars.';
if (strlen($message) > 500)
    $errors[] = 'Message max 500 chars.';

if (!empty($errors)) {
    redirect('error', 'Validation failed: ' . implode(' ', $errors));
}


// ============================================================
// STEP 4: SAVE TO LOG (ALWAYS WORKS!)
// ============================================================
if (!file_exists(LOG_FILE)) {
    $create_file = fopen(LOG_FILE, 'w');
    fwrite($create_file, "CONTACT FORM SUBMISSIONS LOG\n===========================\n");
    fclose($create_file);
}

$log_entry = date('Y-m-d H:i:s') . " | NEW SUBMISSION\n" .
    "Name: {$full_name}\n" .
    "Email: {$email}\n" .
    "Phone: " . ($phone ?: 'Not provided') . "\n" .
    "Subject: {$subject_label}\n" .
    "Message:\n{$message}\n\n";

file_put_contents(LOG_FILE, $log_entry, FILE_APPEND | LOCK_EX);


// ============================================================
// STEP 5: SEND EMAIL (WORKS ON LIVE HOSTS)
// ============================================================
$email_sent = false;
$submitted_at = date('d M Y, H:i') . ' GMT';
$phone_display = !empty($phone) ? $phone : 'Not provided';

// Email headers
$headers = [
    'From' => $email,
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

// Email content
$email_subject = 'New Contact Form Submission: ' . $subject_label;
$email_body = <<<EOT
New Contact Form Submission
===========================
Name: {$full_name}
Email: {$email}
Phone: {$phone_display}
Subject: {$subject_label}
Submitted: {$submitted_at}

Message:
{$message}
EOT;

// Try to send email (works automatically on real web hosts)
if (mail(TARGET_EMAIL, $email_subject, $email_body, $headers)) {
    $email_sent = true;
}


// ============================================================
// STEP 6: Redirect with feedback
// ============================================================
if ($email_sent) {
    redirect('success', "Thank you {$full_name}! Your message has been sent to our team.");
} else {
    redirect('success', "Thank you {$full_name}! Your message has been saved (we’ll get back to you soon).");
}