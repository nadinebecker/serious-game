<?php
header("Content-Type: application/json");

$pdo = new PDO(
    "mysql:host=sql113.infinityfree.com;dbname=if0_41880197_game_db;charset=utf8",
    "if0_41880197",
    "SIht0ys6ALH2Jzx",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// JSON einlesen
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Fallback für InfinityFree
if (!$data || !is_array($data)) {
    $data = $_POST;
}

/* ---------------------------------------------------------
   1) REACTION TRACKING (like, share, warning, comment_open, source_open)
--------------------------------------------------------- */
if (isset($data["session_id"]) && isset($data["post_id"]) && isset($data["user_choice"])) {

    $stmt = $pdo->prepare("
        INSERT INTO reaction (
            session_id,
            post_id,
            user_choice,
            correct,
            comment_text,
            timestamp
        )
        VALUES (
            :session_id,
            :post_id,
            :user_choice,
            :correct,
            :comment_text,
            :timestamp
        )
    ");

    $stmt->execute([
        ":session_id" => $data["session_id"],
        ":post_id" => $data["post_id"],
        ":user_choice" => $data["user_choice"],   // like/share/warning/comment_open/source_open
        ":correct" => $data["correct"] ?? null,   // 1/0 oder null
        ":comment_text" => $data["comment_text"] ?? null,
        ":timestamp" => date("Y-m-d H:i:s")
    ]);

    echo json_encode(["status" => "reaction_saved"]);
    exit;
}

/* ---------------------------------------------------------
   2) FEEDBACK (neues Schema)
--------------------------------------------------------- */

$required = [
    "session_id",
    "aufbau_desinfo_erkennen",
    "aufbau_realismus",
    "ziel_sensibilisierung",
    "ziel_hinweise",
    "weiter_entwicklung_idee",
    "weiter_entwicklung_medienkompetenz",
    "erfahrung_desinfo",
    "erfahrung_sicherheit"
];

$allFieldsPresent = true;
foreach ($required as $field) {
    if (!isset($data[$field])) {
        $allFieldsPresent = false;
    }
}

if ($allFieldsPresent) {

    // Prüfen, ob Session schon Feedback abgegeben hat
    $check = $pdo->prepare("SELECT id FROM feedback WHERE session_id = :session_id");
    $check->execute([":session_id" => $data["session_id"]]);

    if ($check->rowCount() > 0) {
        echo json_encode(["status" => "feedback_exists"]);
        exit;
    }

    // Feedback speichern
    $stmt = $pdo->prepare("
        INSERT INTO feedback (
            session_id,
            aufbau_desinfo_erkennen,
            aufbau_realismus,
            ziel_sensibilisierung,
            ziel_hinweise,
            weiter_entwicklung_idee,
            weiter_entwicklung_medienkompetenz,
            erfahrung_desinfo,
            erfahrung_sicherheit,
            timestamp
        )
        VALUES (
            :session_id,
            :aufbau_desinfo_erkennen,
            :aufbau_realismus,
            :ziel_sensibilisierung,
            :ziel_hinweise,
            :weiter_entwicklung_idee,
            :weiter_entwicklung_medienkompetenz,
            :erfahrung_desinfo,
            :erfahrung_sicherheit,
            :timestamp
        )
    ");

    $stmt->execute([
        ":session_id" => $data["session_id"],
        ":aufbau_desinfo_erkennen" => $data["aufbau_desinfo_erkennen"],
        ":aufbau_realismus" => $data["aufbau_realismus"],
        ":ziel_sensibilisierung" => $data["ziel_sensibilisierung"],
        ":ziel_hinweise" => $data["ziel_hinweise"],
        ":weiter_entwicklung_idee" => $data["weiter_entwicklung_idee"],
        ":weiter_entwicklung_medienkompetenz" => $data["weiter_entwicklung_medienkompetenz"],
        ":erfahrung_desinfo" => $data["erfahrung_desinfo"],
        ":erfahrung_sicherheit" => $data["erfahrung_sicherheit"],
        ":timestamp" => date("Y-m-d H:i:s")
    ]);

    echo json_encode(["status" => "feedback_saved"]);
    exit;
}

echo json_encode(["status" => "ok"]);
