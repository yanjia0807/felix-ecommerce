<?php

$product_name = blc_get_ext('woocommerce-extra')
	->utils
	->get_formatted_title($product->get_id());

if ($product->is_type('variation')) {
	$parent_product = wc_get_product($product->get_parent_id());

	if ($parent_product) {
		$product_name = blc_get_ext(
			'woocommerce-extra'
		)->utils->get_formatted_title($product->get_id());
	}
}

if (! $product_permalink) {
	echo wp_kses_post($product_name);
} else {
	echo wp_kses_post(blc_safe_sprintf(
		'<a href="%s" class="product-name">%s</a>',
		esc_url($product_permalink),
		$product_name
	));

}
if ($product->is_type('variation')) {
	$maybeVariationsAttrs = $product->get_attributes();

	$withDefaultVariation = 'no';

	if ($product->is_type('variable') && blc_theme_functions()->blocksy_manager()) {
		$maybeDefaultVariation = blc_theme_functions()->blocksy_manager()
			->woocommerce
			->retrieve_product_default_variation($product);

		if ($maybeDefaultVariation) {
			$withDefaultVariation = 'yes';
			$maybeVariationsAttrs = $maybeDefaultVariation->get_attributes();
		}
	}

	if (isset($maybeVariations['attributes']) && !empty($maybeVariations['attributes'])) {
		$maybeVariationsAttrs = array_merge(
			$maybeVariationsAttrs,
			$maybeVariations['attributes']
		);
	}

	$attributes_html = [];

	foreach ($maybeVariationsAttrs as $key => $value) {
		$attribute_slug = str_replace('attribute_', '', sanitize_title($key));
		$attribute_label = wc_attribute_label( $attribute_slug );
		$term = get_term_by( 'slug', $value, $attribute_slug);

		$attribute_name = $value;
		$attribute_value = $value;

		if ( $term && ! is_wp_error( $term )  ) {
			$attribute_name = $term->name;
			$attribute_value = $term->slug;
		}

		if (
			$value
		) {
			$attributes_html[] = blocksy_html_tag(
				'dt',
				[
					'data-attribute-slug' => $attribute_slug,
					'data-attribute-val' => $attribute_value
				],
				$attribute_label . ':'
			);

			$attributes_html[] = blocksy_html_tag(
				'dd',
				[],
				$attribute_name
			);
		}
	}

	echo blocksy_html_tag(
		'dl',
		[
			'class' => 'variation',
			'data-default' => $withDefaultVariation
		],
		implode('', $attributes_html)
	);
}

$GLOBALS['product'] = wc_get_product($single_product_id);
woocommerce_template_single_price();
$GLOBALS['product'] = $product;

$mobile_product_actions = blocksy_render_view(
	dirname(__FILE__) . '/product-actions.php',
	[
		'product' => $product,
		'maybeVariations' => $maybeVariations,
		'is_simple_product' => $is_simple_product,
		'is_mobile' => true
	]
);

$maybe_remove_button = blocksy_render_view(
	dirname(__FILE__) . '/product-remove-button.php',
	[
		'single_product_id' => $single_product_id,
		'has_custom_user' => $has_custom_user
	]
);

if (! empty($maybe_remove_button)) {
	$mobile_product_actions .= $maybe_remove_button;
}

echo blocksy_html_tag(
	'div',
	[
		'class' => 'product-mobile-actions ct-hidden-lg'
	],
	$mobile_product_actions
);

