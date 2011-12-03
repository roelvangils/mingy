<?php
/* Mingy Image Replacement Plugin v0.1 by @roelvangils */


/* Change to path where mingo.php and resize.class.php are */
define('PATH', '../');

/* Jarrod Oberto's image resize class does the heavy lifting */
require_once('resize.class.php');

/* Get basic parameters from the rewritten URI */
$file = $_GET['file'];
$loading = $_GET['loading'];
$options = explode(',', $_GET['options']);
$noscriptFallback = $_GET['noscriptfallback'];

/* Set options */
$width = $options[0];
$height = $options[1];
$retina = $options[2];
$supportsRetina = $options[3];
$quality = $options[4];

/* Determine image quality */
if ( ($quality <= 100) && (quality >= 0) )
  $quality = round($quality);
else
  $quality = 50;

/* Double width and height for retina displays (you should only set this to 'true' for debuggine purposes) */
if ( (($retina == 'auto') && ($supportsRetina == 'true')) || ($retina == 'true') ) :
  $width = $width*2;
  $height = $height*2;
endif;

/* Set MIME header */
header('Content-type: image/jpeg');

/* Generate image */
if ( (($loading) && ($noscriptFallback == 'false')) || (($loading) && ($noscriptFallback == 'true') && (@$_COOKIE['js'] == 'true')) ) :
  /* Output smallest possible transparent png as a placeholder (http://garethrees.org/2007/11/14/pngcrush/) */
  print base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQIHWNgYAAAAAMAAU9ICq8AAAAASUVORK5CYII=');
elseif ($loading) :
  /* Read the original file */
  readfile(PATH.$file);
else :
  /* Output optimized image */
  $resizedFile = str_ireplace('.jpg', '', PATH.$file) .'_'.$width.'x'.$height.'_'.$quality.'.jpg';
  if (file_exists($resizedFile)) : /* If in cache, read it. */
    readfile($resizedFile);
  else : /* If not in cache, create it first. Then read it. */
    $resizeObj = new resize(PATH.$file);
    $resizeObj->resizeImage($width, $height, 'crop');
    $resizeObj->saveImage($resizedFile, $quality);
    readfile($resizedFile);
  endif;
endif;
