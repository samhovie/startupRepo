<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <!-- <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"> -->
    <meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width" >
    <!-- <meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width, target-densitydpi=device-dpi"> -->

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="wp-site-blocks">
    <header class="wp-block-template-part nav">
        <?php echo do_blocks('<!-- wp:template-part {"slug":"header"} /-->'); ?>
    </header>
</div>
