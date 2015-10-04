<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @since         0.10.0
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
use Cake\Cache\Cache;
use Cake\Core\Configure;
use Cake\Datasource\ConnectionManager;
use Cake\Error\Debugger;
use Cake\Network\Exception\NotFoundException;

$this->layout = false;

$cakeDescription = Configure::read('Common.title');
?>
<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $cakeDescription ?></title>
    <?= $this->Html->meta('icon') ?>
    <?= $this->element('css'); ?>
</head>
<body class="home">
    <header>
        <ul class="header-right">
            <li>
                <?= $this->Html->image("circle_logo.png", ["alt" => "circle_log", 'url' => ['controller' => 'Pages', 'action' => 'display', "home"], "class" => "logo"]);?>
            </li>
            <li>ver 1.0.0</li>
        </ul>
    </header>
    <div id="content">
        <div class="main_img">
            <?= $this->Html->image('game_logo.png', ['alt' => 'CakePHP']); ?>
        </div>
        <ul>
        <li><?= $this->Html->link("ゲームを始める", ["controller" => "Rooms", "action" => "index"]) ?></li>
        <li><?= $this->Html->link("説明書を読む", ["controller" => "Rooms", "action" => "index"]) ?></li>
        </ul>
    </div>
    <footer>
        <span>copy right</span>
    </footer>
</body>
</html>
