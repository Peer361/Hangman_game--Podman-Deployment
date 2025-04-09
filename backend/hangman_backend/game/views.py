from django.http import JsonResponse
import random

WORDS = ['hangman', 'python', 'container', 'docker', 'podman','sathyabama','jeppiar']

game_state = {
    'word': '',
    'display': '',
    'attempts': 6,
    'guessed_letters': []
}

def start_game(request):
    game_state['word'] = random.choice(WORDS)
    game_state['display'] = '_' * len(game_state['word'])
    game_state['attempts'] = 6
    game_state['guessed_letters'] = []
    return JsonResponse({'display': game_state['display'], 'attempts': game_state['attempts']})

def guess_letter(request, letter):
    if letter in game_state['guessed_letters']:
        return JsonResponse({'message': 'Already guessed', 'display': game_state['display']})

    game_state['guessed_letters'].append(letter)

    if letter in game_state['word']:
        game_state['display'] = ''.join([
            letter if game_state['word'][i] == letter else game_state['display'][i]
            for i in range(len(game_state['word']))
        ])
    else:
        game_state['attempts'] -= 1

    return JsonResponse({
        'display': game_state['display'],
        'attempts': game_state['attempts'],
        'guessed_letters': game_state['guessed_letters']
    })
