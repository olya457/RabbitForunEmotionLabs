import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getSavedQuotes, deleteQuote } from '../store/savedStore';
import { SavedQuoteCard } from '../components/saved/SavedQuoteCard';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { EmptyState } from '../components/common/EmptyState';
import { SavedQuote } from '../types/quiz';
import { RootNavProp } from '../types/navigation';
import { ms } from '../utils/responsive';

export function SavedScreen() {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const navigation = useNavigation<RootNavProp>();

  useFocusEffect(
    useCallback(() => {
      getSavedQuotes().then(setQuotes);
    }, [])
  );

  const handleDelete = async (id: string) => {
    await deleteQuote(id);
    setQuotes(q => q.filter(item => item.id !== id));
  };

  return (
    <ScreenContainer backgroundImage={require('../assets/bg_main.png')}>
      <ScreenHeader
        title="Saved Quotes"
        subtitle={`${quotes.length} quote${quotes.length === 1 ? '' : 's'} saved`}
        onBack={() => navigation.goBack()}
      />

      {quotes.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState
            image={require('../assets/bunny_crossed.png')}
            title="No quotes yet!"
            description={'Take the "Which Bunny Are You?" quiz and save your result quote here.'}
          />
        </View>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: ms(20),
            paddingTop: ms(8),
            paddingBottom: ms(100),
            gap: ms(12),
          }}
          renderItem={({ item }) => (
            <SavedQuoteCard quote={item} onDelete={handleDelete} />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
});
