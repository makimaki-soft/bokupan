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
<body class="help">
    <header>
        <nav >
            <ul class="navbar">
                <li><?= $this->Html->link("", ["controller" => "Pages", "action" => "display"], ["class"=>"glyphicon glyphicon-home"]) ?></li>
                <li><?= $this->Html->link("ゲームを始める", ["controller" => "Rooms", "action" => "index"]) ?></li>
            </ul>
        </nav>
    </header>
    <div id="content">
        <h2>遊び方</h2>
        <section>
            <h4>◯ 概要</h4>
            <table class="table table-bordered">
            <tr>
                <td>タイトル</td>
                <td>僕がパンツを好きになった理由</td>
            </tr>
            <tr>
                <td>対象年齢</td>
                <td>良識のある15歳以上</td>
            </tr>
            <tr>
                <td>プレイ人数</td>
                <td>2〜4人</td>
            </tr>
            </table>
            <p>
            あなたはパンツをこよなく愛する紳士です。家宅にしｎ...訪問しパンツを得て、日々を過ごしていました。
            そんな折、パンツへの愛を競い合うコンテストの存在を耳にします。あなたは自身の愛が一番だと示すため、コンテストに参加することにしました。
            </p>
        </section>
        <section>
            <h4>◯ 画面の見方</h4>
            <p class="center_img"><?= $this->Html->image('map_ver3_nightscape', ['alt' => 'ゲーム画面']); ?></p>
            <p>
            マップ これが今回のコンテスト会場です（マップ全体の絵）
            ターゲットとなる家は９つあります。
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => 'プレイヤー']); ?>
            <span>プレイヤー</span>
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => '住人のいない家']); ?>
            <span>家です。</span>
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => '住人のいる家']); ?>
            <span>家に住人がいる場合、住人アイコンが表示されます。</span>
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => '自分の拠点']); ?>
            <span>自分の拠点です。拠点に変えるまでがパンツコンテンストです。</span>
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => 'ライバルの拠点']); ?>
            <span>ライバルの拠点です。</span>
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => '警察官']); ?>
            <span>巡回中の警察官です。見つかると・・・。</span>
            </p>
            <p class="box-001">
            <?= $this->Html->image('dummy', ['alt' => '巡回ルートの矢印']); ?>
            <span>巡回ルートを示す看板（矢印）がです。警察官は矢印に従って巡回します。</span>
            </p>

            <p>ステータス画面</p>
            <p class="box-001"><?= $this->Html->image('map_ver3_nightscape', ['alt' => '自分のステータス']); ?>
            <span>
            ① ぽっけにいれているパンツ<br>
            ② 拠点に持ち帰ったパンツ<br>
            ③ コンテスト主催者から配られたアイテム。紳士に奇跡を起こします。<br>
            </span>
            </p>
        </section>
        <section>
            <h4>◯ ゲームの流れ</h4>

            <p>
            ゲームは各プレイヤーが順に行動を行うターン制です。
            全区画の住人のパンツを1番最初にすべて集めたプレイヤーが勝ちです。
            警察官に捕まらないように移動したり、警察官の進行方向を変えて戦います。
            </p>

            <div class="panel panel-info">
              <div class="panel-heading">
                 <h5 class="panel-title">1. ターンの開始</h3>
             </div>
             <div class="panel-body">
                ターンの最初に、マップに以下のいずれかの変更が起こります。
                <ul>
                    <li>- 警察官の移動</li>
                    <li>- 住人の帰宅</li>
                    <li>- 巡回ルートの変更</li>
                </ul>
                <span>警察官の移動について</span>
                <p>
                    サイコロを２個振り、出た目の合計分、進行方向に進みます。
                    T字路では矢印の方向に進行方向を変えます。
                </p>
                <span>住人の帰宅について</span>
                <p>
                    ランダムで住人がでかけたり、帰宅したりします。
                </p>
                <span>巡回ルーツの変更について</span>
                 <p>
                     すべての矢印が時計回りに１つずつ回ります。
                 </p>
             </div>
            </div>

            <div class="panel panel-info">
              <div class="panel-heading">
                 <h5 class="panel-title">2. プレイヤーの行動</h3>
             </div>
             <div class="panel-body">
            <p>
            各プレイヤは自分の番に、次のうちどれかを２回行わなければなりません。
            <ul>
                <li>- 移動する</li>
                <li>- パンツを得る</li>
                <li>- 巡回ルートの矢印の向きを変える</li>
                <li>- アイテムを使う</li>
            </ul>
            <span>移動する</span>
            <p>
            ひとつ隣のマスに移動します。
            </p>
            <span>パンツを得る</span>
            <p>
            プレイヤは家の前にいるときパンツを得ることができます。ただし、「家に住人がいるとき」、「自分がその家のパンツを持っているとき」はこの行動をすることができません。
            </p>
            <span>巡回ルートの矢印の向きを変える</span>
            <p>
            プレイヤは矢印の前にいるとき矢印の向きをかえることができます。変えるときは必ず別の方向に変えなければなりません。
            </p>
            <span>アイテムを使う</span>
            <p>
            プレイヤはコンテスト中に以下のアイテムをそれぞれ一回ずつ使用することができます。
            <ul>
                <li>- 警察官に巡回させる</li>
                <li>- ランダムに住人を帰宅させる</li>
                <li>- 巡回ルートの矢印の向きをランダムに変える</li>
            </ul>
           </p>
             </div>
            </div>

            <div class="panel panel-info">
              <div class="panel-heading">
                 <h5 class="panel-title">3. ターンの終了</h3>
             </div>
             <div class="panel-body">
                全プレーヤの行動が終わると１ターンが終了です。
             </div>
            </div>

        </section>

        <section>
            <h4>◯ 逮捕について</h4>
            <p>
            パンツを持った状態で警官とすれ違うか、住人と出くわした場合は逮捕となり、手持ちのパンツをすべて破棄して自分の拠点に戻ります。
            逮捕されずに自分の拠点までパンツを持って帰ることで、パンツをポケットからコレクションにしまうことができます。
            拠点は警察官の巡回ルーツに含まれていません。ライバルの拠点に入ることはできますが、コレクションには加わりません。
            </p>
        </section>

        <section>
            <h4>◯ コンテストの終了について</h4>
            <p>
            すべての家のパンツを最初にコレクションに加えたプレイヤーの勝利となり、コンテンストの終了となります。
            </p>
        </section>
    </div>
    <footer>
        <span>Copyright (C) 2015 <?= $my_copyright ?> All Rights Reserved.</span>
    </footer>

    <?= $this->Html->script('jquery-2.0.3.min.js') ?>
</body>
</html>
