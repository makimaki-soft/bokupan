<div class="rooms form large-10 medium-9 columns">
    <?= $this->Form->create($room, ["class" => "add-form"]) ?>
    <fieldset>
        <legend><?= __('部屋を作る') ?></legend>
        <?php
            echo $this->Form->input('name');
            echo $this->Form->input('host_user');
            echo $this->Form->input('password');
            echo $this->Form->input('message');
        ?>
    </fieldset>
    <div class="btn">
    <?= $this->Form->button('OK', ["class" => "btn btn-primary"]) ?>
    </div>
    <?= $this->Form->end() ?>
</div>
