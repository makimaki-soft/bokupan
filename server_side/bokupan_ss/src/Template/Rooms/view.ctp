<div class="actions columns large-2 medium-3">
    <h3><?= __('Actions') ?></h3>
    <ul class="side-nav">
        <li><?= $this->Html->link(__('Edit Room'), ['action' => 'edit', $room->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Room'), ['action' => 'delete', $room->id], ['confirm' => __('Are you sure you want to delete # {0}?', $room->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Rooms'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Room'), ['action' => 'add']) ?> </li>
    </ul>
</div>
<div class="rooms view large-10 medium-9 columns">
    <h2><?= h($room->name) ?></h2>
    <div class="row">
        <div class="large-5 columns strings">
            <h6 class="subheader"><?= __('Name') ?></h6>
            <p><?= h($room->name) ?></p>
            <h6 class="subheader"><?= __('Host User') ?></h6>
            <p><?= h($room->host_user) ?></p>
            <h6 class="subheader"><?= __('Password') ?></h6>
            <p><?= h($room->password) ?></p>
            <h6 class="subheader"><?= __('Message') ?></h6>
            <p><?= h($room->message) ?></p>
        </div>
        <div class="large-2 columns numbers end">
            <h6 class="subheader"><?= __('Id') ?></h6>
            <p><?= $this->Number->format($room->id) ?></p>
            <h6 class="subheader"><?= __('Member Num') ?></h6>
            <p><?= $this->Number->format($room->member_num) ?></p>
            <h6 class="subheader"><?= __('Host User Pid') ?></h6>
            <p><?= $this->Number->format($room->host_user_pid) ?></p>
        </div>
        <div class="large-2 columns dates end">
            <h6 class="subheader"><?= __('Created') ?></h6>
            <p><?= h($room->created) ?></p>
            <h6 class="subheader"><?= __('Modified') ?></h6>
            <p><?= h($room->modified) ?></p>
        </div>
    </div>
</div>
