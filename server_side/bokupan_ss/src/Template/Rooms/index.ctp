<?php 
    // ページタイトルを設定
    $this->assign('title', $title);
?>

<div class="rooms">
    <table class="table table-striped" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
            <th><?= $this->Paginator->sort('No') ?></th>
            <th><?= $this->Paginator->sort('部屋名') ?></th>
            <th><?= $this->Paginator->sort('人数') ?></th>
            <th><?= $this->Paginator->sort('ホスト') ?></th>
            <th><?= $this->Paginator->sort('メッセージ') ?></th>
            <th class="actions"><?= __('Actions') ?></th>
        </tr>   
    </thead>
    <tbody>
    <?php foreach ($rooms as $room): ?>
        <tr>
            <td><?= h($room->id) ?></td>
            <td><?= h($room->name) ?></td>
            <td><?= $this->Number->format($room->member_num) ?></td>
            <td><?= h($room->host_user) ?></td>
            <td><?= h($room->message) ?></td>
            <td class="actions">
                <?= $this->Html->link(__('入室'), ['action' => 'enter', $room->id, $room->name]) ?>
                <!-- 
                <?= $this->Html->link(__('Edit'), ['action' => 'edit', $room->id]) ?>
                <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $room->id], ['confirm' => __('Are you sure you want to delete # {0}?', $room->id)]) ?>
                -->
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
        <!--
        <p><?= $this->Paginator->counter() ?></p>
        -->
    </div>
</div>
