import { useState } from "react";

import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { api } from "../libs/axios";

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function New(){

    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);


    function handleToggleWeekDays(weekDayIndex: number){
        if(weekDays.includes(weekDayIndex)){
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex])
        }
    }

    async function handleCreateNewHabit() {
        try {
            if(!title.trim() || weekDays.length === 0){
                Alert.alert('Novo hábito', 'Informe todos os dados')
            }

            await api.post('/habits', {
                title,
                weekDays
            })

            setTitle('')
            setWeekDays([])

            Alert.alert('Novo hábito', 'Hábito criado com sucesso!')

        } catch (error){
            console.log(error)
            Alert.alert('Ops', 'Não foi possível criar um novo hábito')
        }
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
                <BackButton />
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Hábito
                </Text>
                <Text className="mt-6 text-white font-semibold text-base">
                    Qual o seu compromentimento?
                </Text>
                <TextInput 
                    placeholder="Exercícios, dormir bem, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    cursorColor={colors.green[600]}
                    onChangeText={setTitle}
                    value={title}
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600 "
                />

                <Text className="mt-4 mb-3 text-white font-semibold text-base">
                    Qual a recorrência?
                </Text>

                {availableWeekDays.map((availableWeekDay, index) => (
                    <Checkbox 
                        key={index} 
                        title={availableWeekDay}
                        onPress={()=> handleToggleWeekDays(index)}
                        checked={weekDays.includes(index)}
                    />
                ))}

                <TouchableOpacity 
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6" 
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather name="check" size={20} color={colors.white} />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}