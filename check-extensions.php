<?php 

echo  "=== Blocksy PHP扩展全面检查 ===\n\n";

$required_extensions = [
    'curl' => 'CURL支持',
    'xml' => 'XML处理',
    'simplexml' => 'SimpleXML处理', 
    'gd' => 'GD图像库',
    'dom' => 'DOM文档处理',
    'iconv' => '字符编码转换',
    'mbstring' => '多字节字符串',
    'zip' => 'ZIP压缩',
    'json' => 'JSON支持',
    'filter' => '数据过滤',
    'openssl' => 'SSL支持'
];

echo "必需扩展检查:\n";
foreach ($required_extensions as $ext => $desc) {
    $status = extension_loaded($ext) ? "✅ 已启用" : "❌ 未启用";
    echo "{$status} - {$desc} ({$ext})\n";
}

echo "\n=== 图像处理扩展检查 ===\n";
echo "GD支持: " . (function_exists('gd_info') ? '✅ 已启用' : '❌ 未启用') . "\n";
if (function_exists('gd_info')) {
    $gd_info = gd_info();
    echo "GD版本: " . ($gd_info['GD Version'] ?? '未知') . "\n";
}

echo "ImageMagick支持: " . (extension_loaded('imagick') ? '✅ 已启用' : '❌ 未启用') . "\n";

echo "\n=== 网络功能检查 ===\n";
echo "file_get_contents外部访问: ";
$test = @file_get_contents('https://creativethemes.com', false, stream_context_create(['http' => ['timeout' => 10]]));
echo $test ? "✅ 正常工作" : "❌ 无法访问外部URL";

echo "\nallow_url_fopen: " . (ini_get('allow_url_fopen') ? '✅ 已启用' : '❌ 已禁用') . "\n";

echo "\n=== 服务器配置检查 ===\n";
echo "PHP版本: " . PHP_VERSION . "\n";
echo "内存限制: " . ini_get('memory_limit') . "\n";
echo "最大执行时间: " . ini_get('max_execution_time') . "秒\n";
echo "POST大小限制: " . ini_get('post_max_size') . "\n";
echo "上传文件限制: " . ini_get('upload_max_filesize') . "\n";

echo "\n=== 检查完成 ===\n";
?>

