<?php

echo blocksy_render_view(
	get_template_directory() . '/inc/panel-builder/header/menu/view.php',
	[
		'atts' => $atts,
		'attr' => $attr,
		'device' => $device,
		'class' => 'header-menu-3',
		'location' => 'menu_3'
	]
);


