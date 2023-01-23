import { useState, useEffect } from "react";

import { useRoute } from '@react-navigation/native';
import { View, ScrollView, Text, Alert } from "react-native";

import { api } from "../libs/axios";

import dayjs from "dayjs";

import colors from 'tailwindcss/colors';

import { Feather } from '@expo/vector-icons';

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import clsx from "clsx";

interface HabitParamsProps {
    date: string;
}

interface HabitsInfo {
    possibleHabits: Array<{
        id: string;
        title: string;
        created_at: string;
    }>,
    completedHabits: string[];
}

export function Habit(){
    const [loading, setLoading] = useState(true);
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const route = useRoute();

    const { date } = route.params as HabitParamsProps;

    const parsedDate = dayjs(date);
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

    const habitsProgress = habitsInfo?.possibleHabits.length ? generateProgressPercentage(habitsInfo.possibleHabits.length, completedHabits.length) : 0

    async function fetchHabits(){
        try{
            setLoading(true);

            const response = await api.get('/day', {
                params: {
                    date
                }
            })

            setHabitsInfo(response.data);
            setCompletedHabits(response.data.completedHabits)

        } catch (error){
            console.log(error);
            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos.');
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);

            if(completedHabits.includes(habitId)){
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        } catch (err) {
            console.log(err);
            Alert.alert('Ops', 'Não foi possível carregar as atualizar o status do hábito.');
        }
    }
    
    useEffect(()=> {
        fetchHabits();
    }, []);

    if(loading){
        return <Loading />;
    }

    
    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
               
                <BackButton/>
                
                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>
                
                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                
                <ProgressBar progress={habitsProgress} />
                
                <View className={clsx("mt-6", {
                    ['opacity-50']: isDateInPast
                })}>
                    {habitsInfo?.possibleHabits ? habitsInfo?.possibleHabits.map(habit => {
                        return(
                            <Checkbox 
                                key={habit.id} 
                                title={habit.title} 
                                checked={completedHabits.includes(habit.id)}
                                onPress={() => handleToggleHabit(habit.id)}
                                disabled={isDateInPast}
                            />
                        )
                    }) :
                    <HabitsEmpty />
                }
                    
                </View>

                {
                    isDateInPast && (
                        <View className="flex-row items-center justify-center mt-10 ">
                            <Feather name="alert-triangle" size={20} color={colors.violet[500]} />
                            <Text className="text-violet-400 ml-2 text-center">
                                Não é possivel alterar o status de hábitos de datas anteriores.
                            </Text>
                        </View>
                    )
                }

            </ScrollView>
        </View>
    )
}