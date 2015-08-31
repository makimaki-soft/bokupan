<?php
namespace App\Controller;

use App\Controller\AppController;

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
    }

    /**
     * enter method
     *
     * @param string|null $name Room name.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function enter($name = null)
    {
        $room = $this->Rooms->find()
            ->where(['name' => $name])
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
     * Edit method
     *
     * @param string|null $id Room id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
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
}
