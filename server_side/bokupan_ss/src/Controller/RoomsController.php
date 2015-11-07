<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Core\Configure;

/**
 * Rooms Controller
 *
 * @property \App\Model\Table\RoomsTable $Rooms
 */
class RoomsController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $this->set('rooms', $this->paginate($this->Rooms));
        $this->set('_serialize', ['rooms']);
        $this->set('title', Configure::read('Room.title'));
    }

    /**
     * enter method
     *
     * @param string|null $name Room name.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function enter($id= null)
    {
        $room = $this->Rooms->find()
            ->where(['id' => $id])
            ->first();
        if(!$room) {
            throw new \Cake\Network\Exception\NotFoundException('Could not find that room'); 
        }
        $this->set('room', $room);
        $this->set('_serialize', ['room']);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $room = $this->Rooms->newEntity();
        if ($this->request->is('post')) {
            // 部屋作成時にシステム側で入力する値を設定
            $post = $this->request->data;
            $post["member_num"] = 1; // 部屋人数を1人に
            $room = $this->Rooms->patchEntity($room, $post);
            if ($this->Rooms->save($room)) {
                $this->Flash->success(__('The room has been saved.'));
                //return $this->redirect(['action' => 'index']);
                return $this->redirect(['action' => 'enter', $room->id, $room->name]);
            } else {
                $this->Flash->error(__('The room could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('room'));
        $this->set('_serialize', ['room']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Room id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $this->log($this->request);
        $room = $this->Rooms->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $room = $this->Rooms->patchEntity($room, $this->request->data);
            if ($this->Rooms->save($room)) {
                $this->Flash->success(__('The room has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The room could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('room'));
        $this->set('_serialize', ['room']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Room id.
     * @return void Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $room = $this->Rooms->get($id);
        if ($this->Rooms->delete($room)) {
            $this->Flash->success(__('The room has been deleted.'));
        } else {
            $this->Flash->error(__('The room could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }

    /**
     * Ready method
     * jsから実行されるmethod hostとなるクライアントのpeer idを保存する
     *
     * @param
     *   string|null $id Room id.
     *   string|null $peer_id クライアントで発行したpeer id.
     * @return bool
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function ready($id = null, $peer_id = null) {
        $this->log($this->request);
        if(is_null($peer_id)) {
            throw new \Cake\Network\Exception\BadRequestException('Invalid Parameter'); 
        }
        $room = $this->Rooms->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['get'])) {
            $room = $this->Rooms->patchEntity($room, $this->request->data);
            $room['host_user_pid'] = $peer_id;
            $this->log($room);
            if ($this->Rooms->save($room)) {
                $this->Flash->success(__('The room has been saved.'));
            } else {
                $this->Flash->error(__('The room could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('room'));
        $this->set('_serialize', ['room']);
    }


}
