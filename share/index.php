<?php
  header('Location: ../sjd_' . md5(time()) . '?' . $_SERVER['QUERY_STRING']);
?>
