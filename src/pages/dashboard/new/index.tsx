import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { FiTrash, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/input'
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from '../../../contexts/AuthContext'
import { v4 as uuidV4 } from 'uuid'
import { storage, db } from '../../../services/firebaseConnection'
import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
 } from 'firebase/storage'
 import { addDoc, collection } from 'firebase/firestore';

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatório"),
  year: z.string().min(1, "O ano do carro é obrigatório"),
  km: z.string().min(1, "O km do carro é obrigatório"),
  price: z.string().min(1, "O preço do carro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  whatsapp: z.string().min(1, "O Telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
    message: "Número de telefone inválido"
  }),
  description: z.string().min(1, "A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
   uid: string;
   name: string;
   previewUrl: string;
   url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"

  })
  
  const [carImages, setCarImages] = useState<ImageItemProps[]>([])

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]
      
      if (image.type === 'image/jpeg' || image.type === 'image/png'){
        await handleUpload(image)
      }   
      else{
        alert('Envie uma imagem jpeg ou png')
        return;
      }   
    }
  }

  async function handleUpload(image: File){
    if (!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)
    uploadBytes(uploadRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl
        }

        setCarImages((images) => [...images, imageItem])
      })
    })
  }

  function onSubmit(data: FormData) {
    if (carImages.length === 0){
      alert("Envie alguma imagem deste carro!")
      return;
    }

    const carListImages = carImages.map(car => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url
      }
    })

    addDoc(collection(db, 'cars'), {
      name: data.name,
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages 
    })
    .then(() => {
      reset()
      setCarImages([])
      console.log("Cadastrado com sucesso!")
    })
    .catch((error) => {
      console.log(error)
      console.log("Erro ao cadastrar no banco")
    })
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try{
      await deleteObject(imageRef)
      setCarImages(carImages.filter((car) => car.url !== item.url))
    }
    catch(err){
      console.log("ERRO AO DELETAR")
    }
  }

  return (
    <Container >
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="opacity-0 cursor-pointer" 
              onChange={handleFile} 
            />
          </div>
        </button>

        {carImages.map(item => (
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <button className="absolute z-10" onClick={() => handleDeleteImage(item)} >
              <FiTrash size={28} color="#FFF" />
            </button>
            <img 
              src={item.previewUrl} 
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do carro"
             />
          </div>
        ))}

      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <p className=",">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Audi R8"
            />
          </div>

          <div className="mb-3">
            <p className=",">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 5.2 V10..."
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2019/2020..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 12.900..."
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / WhatsApp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 41999009900..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Curitiba..."
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: R$ 450.000,00"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea 
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro"
            />            
            {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
          </div>

          <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
            Cadastrar
          </button>

        </form>
      </div>

    </Container>
  );
}
