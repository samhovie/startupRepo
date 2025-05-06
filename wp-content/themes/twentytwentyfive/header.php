<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <!-- <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"> -->
    <!-- <meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width" > -->

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- <meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width, target-densitydpi=device-dpi"> -->
    <script src="https://kit.fontawesome.com/e7aa5fed1a.js" crossorigin="anonymous"></script>

    <link rel="icon" href="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/favicon.ico" sizes="any">
<!-- <link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1E3050"> -->

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="wp-site-blocks">
    <header class="wp-block-template-part nav">
        <!-- <php echo do_blocks('wp:template-part {"slug":"header"} /'); ?> -->
        <img  id='title-icon' src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/ethereaicon.png">
        <a class="wp-block-site-title"
        id="title-text"
        href="https://ethereaweb.com"
        style="text-decoration: none !important;" target="_self" rel="home"
        aria-current="page">Etherea Web Technologies</a>
    </header>
</div>
