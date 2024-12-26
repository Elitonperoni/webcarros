import { useState, useEffect } from 'react'
import { Container } from "../../components/container";
import {
  collection,
  query,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from '../../services/firebaseConnection'

interface CarProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[]
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);

  useEffect(() => {
    function loadCars(){
      const carRef = collection(db, "cars")
      const queryRef = query(carRef, orderBy("created", "desc"))
      
      getDocs(queryRef)
      .then((snapshot) => {
        let listcars = [] as CarProps[];

        snapshot.forEach(doc => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid
          })
        })
       setCars(listcars)
      })
    }
    loadCars()
  }, [])

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="2-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro..."
        />
        <button
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

       {cars.map(car => (
         <section key={car.id} className="w-full bg-white rounded-lg">
         <img
           className="w-full rounded-lg mb-2 max-h-90 hover:scale-105 transition-all"
           src={car.images[0].url}
           alt="Carro" />
         <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

         <div className="flex flex-col px-2">
           <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
           <strong className="text-black font-medium text-xl">R$ {car.price}</strong>
         </div>

         <div className="w-full h-px bg-slate-200 my-2"></div>

         <div className="px-2 pb-2">
           <span className="text-zinc-700">
             {car.city}
           </span>
         </div>
       </section>
       ))}

      </main>
    </Container>
  );
}
