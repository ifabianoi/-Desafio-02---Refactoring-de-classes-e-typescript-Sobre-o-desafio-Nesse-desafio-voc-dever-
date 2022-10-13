import { useState, useEffect } from "react";

import Header from '../../components/Header';
import FoodContainer from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { Food, FoodItem } from "../../types/Foods";
import api from '../../services/api';
import { FoodsContainer } from './styles';

const Dashboard = () => {
  const [ foods, setFoods ] = useState<FoodItem[]>([]);
  const [ editingFood, setEditingFood ] = useState({} as FoodItem);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ editModalOpen, setEditModalOpen ] = useState(false);
  
  useEffect(() => {
    async function loadFood() {
      const response = await api.get('/foods');
      const data = response.data;
      setFoods(data);
    }

    loadFood();
  }, []);

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodItem) {
    try {
      const foodUpdated = await api.put(`/foods/${food.id}`, food);

      const foodsUpdated = foods.map((item) =>
        item.id !== foodUpdated.data.id ? item : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter((food) => food.id !== id);

      setFoods(foodsFiltered);
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodItem) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <FoodContainer
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
