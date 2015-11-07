<?php
namespace App\Model\Table;

use App\Model\Entity\Room;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Rooms Model
 *
 */
class RoomsTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('rooms');
        $this->displayField('name');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create');

        $validator
            ->requirePresence('name', 'create')
            ->notEmpty('name')
            ->add('name', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

        $validator
            ->add('member_num', 'valid', ['rule' => 'numeric'])
            ->requirePresence('member_num', 'create')
            ->notEmpty('member_num');

        $validator
            ->requirePresence('host_user', 'create')
            ->notEmpty('host_user');

        $validator
            ->add('host_user_pid', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('host_user_pid')
            ->add('host_user_pid', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

        $validator
            ->allowEmpty('password');

        $validator
            ->allowEmpty('message');

        return $validator;
    }
}
