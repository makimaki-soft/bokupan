

<span id="info" 
	data-room-id=<?= h($room->id) ?>
	data-room-name=<?= h($room->name) ?>
	data-room-hpid="<?= h($room->host_user_pid) ?>"
	data-room-member=<?= h($room->member_num) ?>
>
	部屋名: <?= h($room->name) ?>
</span>
人数: <?= h($room->member_num) ?>

<canvas id="gameCanvas" width="375" height="667"></canvas>

<?= $this->Html->script('https://skyway.io/dist/0.3/peer.min.js'); ?>
<?= $this->Html->script('https://code.jquery.com/jquery-2.1.4.min.js'); ?>
<?= $this->Html->script('rtc'); ?>
<?= $this->Html->script('/res/loading.js'); ?>
<?= $this->Html->script('/frameworks/cocos2d-html5/CCBoot.js', ["cocos"]); ?>
<?= $this->Html->script('main'); ?>

