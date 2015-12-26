<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>僕がパンツを好きになった理由</title>
</head>

<body>

<span id="info" 
	data-room-id=<?= h($room->id) ?>
	data-room-name=<?= h($room->name) ?>
	data-room-hpid="<?= h($room->host_user_pid) ?>"
	data-room-member=<?= h($room->member_num) ?>
>
</span>

<canvas id="gameCanvas" width="100%" height="100%"></canvas>

<?= $this->Html->script('https://skyway.io/dist/0.3/peer.min.js'); ?>
<?= $this->Html->script('https://code.jquery.com/jquery-2.1.4.min.js'); ?>
<?= $this->Html->script('rtc'); ?>
<?= $this->Html->script('/res/loading.js'); ?>
<?= $this->Html->script('/frameworks/cocos2d-html5/CCBoot.js', ["cocos"]); ?>
<?= $this->Html->script('main'); ?>

</body>
</html>