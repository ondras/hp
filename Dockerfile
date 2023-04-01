FROM ondras/php:1.3

WORKDIR /var/www/html

COPY root .
COPY .repos/texty/banda-bukanyru texty/banda-bukanyru
COPY .repos/texty/compress texty/compress
COPY .repos/texty/cv texty/cv
COPY .repos/texty/fotc texty/fotc
COPY .repos/texty/korona texty/korona
COPY .repos/texty/proktolog texty/proktolog
COPY .repos/texty/romantika texty/romantika

COPY .repos/slides slides
RUN rm slides/public.json

#COPY .repos/derivative-captcha derivative-captcha
#COPY .repos/oz.php oz.php
#COPY .repos/qr qr
#COPY .repos/wwwsqldesigner sql/demo

#COPY .repos/just-spaceships games/just-spaceships
#COPY .repos/7drl-2019 games/7drl-2019
#COPY .repos/wild-west games/wild-west
#COPY .repos/js-like games/js-like
