<div class="rooms form large-10 medium-9 columns">
    <?= $this->Form->create($room, ["class" => "add-form"]) ?>
    <fieldset>
        <legend><?= __('部屋を作る') ?></legend>
        <?php
            echo $this->Form->input('部屋名', ["required"=>"true"]);
            echo $this->Form->input('ホスト', ["required"=>"true"]);
            echo $this->Form->input('メッセージ', ["required"=>"true"]);
        ?>
    </fieldset>
    <div class="btn">
    <?= $this->Form->button('OK', ["class" => "btn btn-primary"]) ?>
    </div>
    <?= $this->Form->end() ?>
</div>
