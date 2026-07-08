<?php

header("Content-Type: text/plain");

// DB verbinden
$pdo = new PDO(
    "mysql:host=sql113.infinityfree.com;dbname=if0_41880197_game_db;charset=utf8",
    "if0_41880197",
    "SIht0ys6ALH2Jzx",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Daten einlesen
$data = $_POST;

if (!$data || !is_array($data)) {
    $raw = file_get_contents("php://input");
    $json = json_decode($raw, true);
    if ($json && is_array($json)) {
        $data = $json;
    }
}

/* ---------------------------------------------------------
   1) REACTION
--------------------------------------------------------- */
if (
    isset($data["session_id"]) &&
    isset($data["post_id"]) &&
    isset($data["user_choice"])
) {

    $stmt = $pdo->prepare("
        INSERT INTO reaction (
            session_id,
            post_id,
            user_choice,
            timestamp
        )
        VALUES (
            :session_id,
            :post_id,
            :user_choice,
            :timestamp
        )
    ");

    $stmt->execute([
        ":session_id" => $data["session_id"],
        ":post_id" => $data["post_id"],
        ":user_choice" => $data["user_choice"],
        ":timestamp" => date("Y-m-d H:i:s")
    ]);

    echo "reaction_saved";
    exit;
}

/* ---------------------------------------------------------
   2) FEEDBACK
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

    $check = $pdo->prepare("SELECT id FROM feedback WHERE session_id = :session_id");
    $check->execute([":session_id" => $data["session_id"]]);

    if ($check->rowCount() > 0) {
        echo "feedback_exists";
        exit;
    }

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

    echo "feedback_saved";
    exit;
}

/* ---------------------------------------------------------
   3) RESULTS
--------------------------------------------------------- */

if (
    isset($data["session_id"]) &&
    isset($data["level"])
) {

    $stmt = $pdo->prepare("
        INSERT INTO results (
            session_id,
            level,
            timestamp
        )
        VALUES (
            :session_id,
            :level,
            :timestamp
        )
    ");

    $stmt->execute([
        ":session_id" => $data["session_id"],
        ":level" => $data["level"],
        ":timestamp" => date("Y-m-d H:i:s")
    ]);

    echo "results_saved";
    exit;
}

echo "ok";
