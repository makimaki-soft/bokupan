<div class="actions columns large-2 medium-3">
    <h3><?= __('Actions') ?></h3>
    <ul class="side-nav">
        <li><?= $this->Html->link(__('List Rooms'), ['action' => 'index']) ?></li>
    </ul>
</div>
<div class="rooms form large-10 medium-9 columns">
    <?= $this->Form->create($room) ?>
    <fieldset>
        <legend><?= __('Add Room') ?></legend>
        <?php
            echo $this->Form->input('name');
            echo $this->Form->input('member_num');
            echo $this->Form->input('host_user');
            echo $this->Form->input('host_user_pid');
            echo $this->Form->input('password');
            echo $this->Form->input('message');
        ?>
    </fieldset>
    <?= $this->Form->button(__('Submit')) ?>
    <?= $this->Form->end() ?>
</div>
