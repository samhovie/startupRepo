<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <!-- <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"> -->
    <meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width" >
    <!-- <meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width, target-densitydpi=device-dpi"> -->
    <script src="https://kit.fontawesome.com/e7aa5fed1a.js" crossorigin="anonymous"></script>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="wp-site-blocks">
    <header class="wp-block-template-part nav">
        <!-- <php echo do_blocks('wp:template-part {"slug":"header"} /'); ?> -->
        <p style="text-decoration: none !important;" class="wp-block-site-title"><a href="https://ethereaweb.com" style="text-decoration: none !important;" target="_self" rel="home" aria-current="page">Etherea Web Technologies</a></p>
    </header>
</div>
