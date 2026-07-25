<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$directories = ['src', 'public', 'routes', 'tests', 'scripts'];
$failures = [];
$checked = 0;

foreach ($directories as $directory) {
    $path = $root . DIRECTORY_SEPARATOR . $directory;
    if (!is_dir($path)) {
        continue;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if (!$file instanceof SplFileInfo || $file->getExtension() !== 'php') {
            continue;
        }

        $checked++;
        $command = escapeshellarg(PHP_BINARY)
            . ' -l '
            . escapeshellarg($file->getPathname())
            . ' 2>&1';
        exec($command, $output, $exitCode);

        if ($exitCode !== 0) {
            $failures[] = implode(PHP_EOL, $output);
        }

        $output = [];
    }
}

if ($failures !== []) {
    fwrite(STDERR, implode(PHP_EOL . PHP_EOL, $failures) . PHP_EOL);
    exit(1);
}

fwrite(STDOUT, sprintf("PHP syntax OK: %d file(s)%s", $checked, PHP_EOL));
