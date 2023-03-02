import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import colors from "tailwindcss/colors";

import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'
import { Feather } from '@expo/vector-icons';

import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loadiang } from "../components/Loading";
import { HabitEmpty } from "../components/HabitEmpty";

import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { dateFormat } from "../utils/firestoreDateformat";

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
interface HabitsProps {
    id: string;
    title: string;
    day?: string;
    weekDays: number[];
    dateCompleted: string[],
    idHabitCompleted: string[]
    dateRemoved: string
}
interface DaysCompletedProps {
    id: string,
    date: string;
    possibles: string;
    completed: string;
}


export function Habit() {
    const route = useRoute();
    const { date } = route.params as Params;
    const [loading, setLoading] = useState(true);
    const [habitsPossible, setHabitsPossible] = useState<HabitsProps[]>([])
    const [daysCompleted, setDaysCompleted] = useState<DaysCompletedProps[]>([])

    const weekDay = dayjs(date).get('day');
    const parsedDate = dayjs(date);
    const isDatePast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');
    let completed = false;
    let cont = 0;
    let contCompleted = 0;
    let completo = ['']

    function somarum() {
        cont = cont + 1
    }
    function somarumCompleted() {
        contCompleted = contCompleted + 1
    }
    async function handleToggleHabit(habitId: string) {

        try {
            habitsPossible.map(habits => (
                habits.day &&
                    date >= habits.day ?
                    habits.weekDays.map(day => (
                        day == weekDay ?
                            habits.idHabitCompleted.includes(habitId) && habits.dateCompleted.includes(date) ?
                                completed = true : null
                            : null

                    )) : null
            ))

            if (completed) {
                habitsPossible.map(habits => (
                    habits.day &&
                        habits.idHabitCompleted.includes(habitId) ?
                        habits.dateCompleted.map(dateCom => (
                            completo.push(dateCom)
                        )) : null

                ))
                completo = completo.filter(day => day !== date)

                completo = completo.filter(function (i) {
                    return i
                })
                firestore()
                    .collection('habit')
                    .doc(habitId)
                    .update({
                        dateCompleted: completo
                    })

                daysCompleted.map(day => (
                    date == day.date ? 
                    firestore()
                    .collection('daysCompleted')
                    .doc(day.id)
                    .update({
                        completed: contCompleted - 1
                    })
                    : null
                ))

            } else {
                habitsPossible.map(habits => (
                    habits.day &&
                        habits.idHabitCompleted.includes(habitId) ?
                        habits.dateCompleted.map(dateCom => (
                            completo.push(dateCom)
                        )) : null
                ))

                completo.push(date)

                completo = completo.filter(function (i) {
                    return i
                })

                firestore()
                    .collection('habit')
                    .doc(habitId)
                    .update({
                        idHabitCompleted: [habitId],
                        dateCompleted: completo
                    })

                    daysCompleted.length > 0 ?
                    daysCompleted.map(days => (
                        days.date == date ?
                        firestore()
                        .collection('daysCompleted')
                        .doc(days.id)
                        .update({
                            date: date,
                            possibles: cont,
                            completed: contCompleted + 1
                        })
                        
                    :
                    firestore()
                        .collection('daysCompleted')
                        .add({
                            date: date,
                            possibles: cont,
                            completed: contCompleted + 1
                        })
                                
                    ))
                    :
                    firestore()
                        .collection('daysCompleted')
                        .add({
                            date: date,
                            possibles: cont,
                            completed: contCompleted + 1
                        })

            }


            completed = false


        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possivel atualizar os status do hábito');
        }
    }
    function deleteHabit(habitId: string){
        firestore().
        collection('habit')
        .doc(habitId)
        .update({
            dateRemoved: date
        })
    }

    useEffect(() => {
        firestore().
            collection("habit")
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { title, created_at, weekDays, completed, dateCompleted, idHabitCompleted, dateRemoved } = doc.data()

                    return {
                        id: doc.id,
                        title,
                        day: dateFormat(created_at),
                        weekDays,
                        dateCompleted,
                        idHabitCompleted,
                        dateRemoved
                    }
                })
                setHabitsPossible(data)
                setLoading(false)
            })

        firestore()
            .collection('daysCompleted')
            .onSnapshot(snaphot => {
                const data = snaphot.docs.map(doc => {
                    const { date, possibles, completed } = doc.data()

                    return {
                        id: doc.id,
                        date,
                        possibles,
                        completed
                    }
                })
                setDaysCompleted(data)
            })

    }, [])

    if (loading) {
        return (
            <Loadiang />
        )
    }

    habitsPossible.map(habits => (
        console.log(habits.dateRemoved < date)
    ))

    return (
        <View className="flex-1 bg-background px-8 pt-16" >
            {
                habitsPossible.map(habits => (
                    habits.day &&
                        date >= habits.day && date < habits.dateRemoved ?
                        habits.weekDays.map(day => (
                            day == weekDay ? somarum() : null
                        )) : null
                ))
            }
            {
                habitsPossible.map(habits => (
                    habits.day &&
                        date >= habits.day ?
                        habits.weekDays.map(day => (
                            day == weekDay ?
                                habits.dateCompleted.includes(date) ? somarumCompleted() : null
                                : null

                        )) : null
                ))
            }
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >

                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                <View>
                </View>
                <ProgressBar progress={generateProgressPercentage(cont, contCompleted)} />

                <View>
                </View>
                <View className={clsx("mt-6", {
                    ["opacity-50"]: isDatePast
                })}>
                    {
                        habitsPossible.map(habits => (
                            habits.day &&
                                date >= habits.day && date > habits.dateRemoved ?
                                habits.weekDays.map(day => (
                                    day == weekDay ? 
                                    <View key={habits.id} className="w-full flex-row justify-between" >
                                        <Checkbox
                                            key={habits.id}
                                            title={habits.title}
                                            disabled={isDatePast}
                                            onPress={() => handleToggleHabit(habits.id)}
                                            checked={habits.dateCompleted.includes(date)}
                                        />
                                        <TouchableOpacity>
                                            <Feather
                                                name="delete"
                                                size={24}
                                                color={colors.zinc[400]}
                                                onPress={() => deleteHabit(habits.id)}
                                            />
                                                
                                        </TouchableOpacity>
                                    </View>
                                        : null
                                ))
                                : null
                        ))
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