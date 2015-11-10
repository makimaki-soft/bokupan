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

$my_title = Configure::read('Common.title');
$my_copyright = Configure::read('Common.copyright');

?>
<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $my_title ?></title>
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
            <?= $this->Html->image('game_logo.png', ['alt' => 'ぼくばん']); ?>
        </div>
        <ul class="menu">
        <li><?= $this->Form->button("ゲームを始める",["class" => "btn btn-primary a-btn", "data-url" => "/bokupan-ss/rooms"]) ?></li>
        <li><?= $this->Form->button("説明書を読む",["class" => "btn btn-success a-btn", "data-url" => "/bokupan-ss/help"]) ?></li>
        </ul>
    </div>

    <footer>
        <span>Copyright (C) 2015 <?= $my_copyright ?> All Rights Reserved.</span>
    </footer>

    <?= $this->Html->script('jquery-2.0.3.min.js') ?>
    <?= $this->Html->script('action.js') ?>
    <?= $this->Html->script('sakura.js') ?>
</body>
</html>
