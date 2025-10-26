<?php

use Blocksy\Extensions\WoocommerceExtra\WaitlistEmail;

if (! defined('ABSPATH')) {
	exit;
}

$product = WaitlistEmail::get_dummy_or_product_data($product);

$image_src = $product->get_image_id() ? wp_get_attachment_image_src($product->get_image_id(), 'thumbnail')[0] : wc_placeholder_img_src();
$image_size = wc_get_image_size('thumbnail');
?>

<?php do_action('woocommerce_email_header', $email_heading, $email); ?>

<p>
	<?php
		echo wp_kses(
			blocksy_safe_sprintf(
				__('Hi, %s!', 'blocksy-companion'),
				$user_name
			),
			true
		)
	?>
</p>

<p>
	<?php echo esc_html__('You have been successfully added to the waitlist for the following item:', 'blocksy-companion'); ?>
</p>

<table class="td ct-product-table" cellspacing="0" cellpadding="6" border="1">
	<thead>
		<tr>
			<th class="td" scope="col"></th>
			<th class="td" scope="col"><?php echo esc_html__('Product', 'blocksy-companion'); ?></th>
			<th class="td ct-align-end" scope="col"><?php echo esc_html__('Price', 'blocksy-companion'); ?></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="td ct-image-column">
				<a href="<?php echo esc_url($product->get_permalink()) ?>">
					<img 
						src="<?php echo $image_src; // phpcs:ignore. ?>"
						alt="<?php echo esc_html($product->get_name()); ?>"
						width="<?php echo esc_attr( $image_size['width'] ); ?>"
						height="<?php echo esc_attr( $image_size['height'] ); ?>"
					/>
				</a>
			</td>
			<td class="td">
				<a href="<?php echo esc_url($product->get_permalink()) ?>">
					<?php echo esc_html($product->get_name()); ?>
				</a>
			</td>
			<td class="td ct-align-end">
				<?php echo wc_price( $product->get_price() ) ?>
			</td>
		</tr>
	</tbody>
</table>

<p>
	<small>
		<?php echo wp_kses(
			blocksy_safe_sprintf(
					__('If you don\'t want to receive any further notifications, please %s', 'blocksy-companion'),
					'<a href="' . esc_url($unsubscribe_link) . '">' . esc_html__('unsubscribe', 'blocksy-companion') . '</a>'
				),
				true
			);
		?>
	</small>
</p>

<?php do_action('woocommerce_email_footer', $email); ?>