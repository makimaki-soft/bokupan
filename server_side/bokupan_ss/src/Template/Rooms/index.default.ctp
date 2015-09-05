<div class="actions columns large-2 medium-3">
    <h3><?= __('Actions') ?></h3>
    <ul class="side-nav">
        <li><?= $this->Html->link(__('New Room'), ['action' => 'add']) ?></li>
    </ul>
</div>
<div class="rooms index large-10 medium-9 columns">
    <table cellpadding="0" cellspacing="0">
    <thead>
        <tr>
            <th><?= $this->Paginator->sort('id') ?></th>
            <th><?= $this->Paginator->sort('name') ?></th>
            <th><?= $this->Paginator->sort('member_num') ?></th>
            <th><?= $this->Paginator->sort('host_user') ?></th>
            <th><?= $this->Paginator->sort('host_user_pid') ?></th>
            <th><?= $this->Paginator->sort('password') ?></th>
            <th><?= $this->Paginator->sort('message') ?></th>
            <th class="actions"><?= __('Actions') ?></th>
        </tr>
    </thead>
    <tbody>
    <?php foreach ($rooms as $room): ?>
        <tr>
            <td><?= $this->Number->format($room->id) ?></td>
            <td><?= h($room->name) ?></td>
            <td><?= $this->Number->format($room->member_num) ?></td>
            <td><?= h($room->host_user) ?></td>
            <td><?= $this->Number->format($room->host_user_pid) ?></td>
            <td><?= h($room->password) ?></td>
            <td><?= h($room->message) ?></td>
            <td class="actions">
                <?= $this->Html->link(__('View'), ['action' => 'view', $room->id]) ?>
                <?= $this->Html->link(__('Edit'), ['action' => 'edit', $room->id]) ?>
                <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $room->id], ['confirm' => __('Are you sure you want to delete # {0}?', $room->id)]) ?>
            </td>
        </tr>

    <?php endforeach; ?>
    </tbody>
    </table>
    <div class="paginator">
        <ul class="pagination">
            <?= $this->Paginator->prev('< ' . __('previous')) ?>
            <?= $this->Paginator->numbers() ?>
            <?= $this->Paginator->next(__('next') . ' >') ?>
        </ul>
        <p><?= $this->Paginator->counter() ?></p>
    </div>
</div>
