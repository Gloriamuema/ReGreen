<?php
header("Content-Type: application/json");
include 'db.php';

$action = $_GET['action'] ?? '';

if ($action == 'get_parcels') {
  $res = $conn->query("SELECT * FROM land_parcels");
  $data = $res->fetch_all(MYSQLI_ASSOC);
  echo json_encode($data);
}

elseif ($action == 'recommend' && isset($_GET['id'])) {
  $id = intval($_GET['id']);
  $parcel = $conn->query("SELECT * FROM land_parcels WHERE id=$id")->fetch_assoc();
  if (!$parcel) { echo json_encode(["error"=>"Parcel not found"]); exit; }

  $species = $conn->query("SELECT * FROM native_species");
  $best = [];
  while ($s = $species->fetch_assoc()) {
    $score = 0;

    // Simple AI-like rule matching
    if ($parcel['land_type'] == $s['land_type']) $score += 40;
    if ($parcel['rainfall'] >= $s['rainfall_min'] && $parcel['rainfall'] <= $s['rainfall_max']) $score += 30;
    if ($parcel['temperature'] >= $s['temperature_min'] && $parcel['temperature'] <= $s['temperature_max']) $score += 20;
    if ($parcel['slope'] < 15) $score += 10;

    $s['score'] = $score;
    $best[] = $s;
  }

  usort($best, fn($a,$b)=>$b['score']<=>$a['score']);
  echo json_encode($best);
}

$conn->close();
?>
