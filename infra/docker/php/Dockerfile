FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        icu-dev \
        libzip-dev \
        oniguruma-dev \
    && docker-php-ext-install \
        dom \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        xml \
        xmlwriter \
        zip \
    && rm -rf /tmp/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY infra/docker/php/php.ini /usr/local/etc/php/conf.d/99-prism.ini

WORKDIR /var/www/html

CMD ["php-fpm", "-F"]
