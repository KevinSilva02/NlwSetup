import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from '@react-navigation/native';
import dayjs from "dayjs";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loadiang } from "../components/Loading";
import { api } from "../lib/axios";
import { HabitEmpty } from "../components/HabitEmpty";
import clsx from "clsx";

interface Params {
    date: string
}
interface DayInfoProps {
    completedHabits: string[]
    posibleHabits: {
        id: string;
        title: string;
    }[]

}

export function Habit(){
    const route = useRoute();
    const { date } = route.params as Params;
    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState <DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const parsedDate = dayjs(date);
    const isDatePast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const habitsProgress = dayInfo?.posibleHabits.length ? generateProgressPercentage(dayInfo.posibleHabits.length, completedHabits.length) : 0

    async function fetchHabits(){
        try {
            setLoading(true)

            const response = await api.get('/day', { params: {date}});
            setDayInfo(response.data);
            console.log(response.data)
            setCompletedHabits(response.data.completedHabits)
            
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel carregar')
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string){
        try {
            await api.patch(`/habits/${habitId}/toggle`);

            if(completedHabits.includes(habitId)){
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
            } else {
                setCompletedHabits(prevState => [...prevState, habitId]);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Ops','Não foi possivel atualizar os status do hábito');
        }
    }

    useEffect(() => {
        fetchHabits();
    },[])

    if(loading){
        return(
            <Loadiang />
        )
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16" >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>
                
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6",{
                    ["opacity-50"]: isDatePast
                })}>
                    {
                        dayInfo?.posibleHabits ? 
                        dayInfo?.posibleHabits.map(habit => (
                            <Checkbox 
                                key={habit.id}
                                title={habit.title}
                                disabled={isDatePast}
                                checked={completedHabits.includes(habit.id)}
                                onPress={()=> handleToggleHabit(habit.id)}
                            />
                        )):
                        <HabitEmpty />
                    }

                </View>
                {
                    isDatePast && (
                        <Text className="text-white mt-10 text-center">
                            Você não pode editar hábitos de uma data passada 
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    )
}