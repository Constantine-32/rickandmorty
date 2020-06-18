const baseURL = 'https://rickandmortyapi.com/api/'

axios.get(baseURL).then(response => getEpisodesList(response.data.episodes))

function getEpisodesList(episodesURL) {
  axios.get(episodesURL).then(response => {
    createEpisodesList(response.data.results)
    createNextButton(response.data.info.next)
  })
}

function createEpisodesList(episodes) {
  episodes.forEach(createEpisodeList)
  episodes.forEach(createEpisode)
}

function createNextButton(episodesURL) {
  if (!episodesURL) return
  $('aside').append(
    $('<button>', {
      class: 'season-button',
      text: 'Load more...'
    }).on('click', function () {
      $(this).remove()
      getEpisodesList(episodesURL)
    })
  )
}

function createEpisodeList(episode) {
  const season = episode.episode.split('E')[0]
  getEpisodeListWraper(season).append(
    $('<li>', {
      id: episode.id,
      class: 'episode-item'
    }).append(
      $('<span>').text(episode.episode)
    ).on('click', () => {
      getEpisode(episode.url)
    })
  )
}

function getEpisodeListWraper(season) {
  if (!$('#' + season).length) createEpisodeListWrapper(season)
  return $('#' + season)
}

function createEpisodeListWrapper(season) {
  $('aside').append(
    $('<h2>', {
      class: 'season-title',
      text: 'Season ' + parseInt(season.replace('S', ''))
    }),
    $('<ol>', {
      'id': season,
      'class': 'episode-wrapper'
    })
  )
}

function getEpisode(episodeURL) {
  axios.get(episodeURL).then(response => {
    createEpisodeHeader(response.data)
    createCharacters(response.data.characters)
  })
}

function getCharacter(characterURL) {
  axios.get(characterURL).then(response => {
    createCharacterHeader(response.data)
    createEpisodes(response.data.episode)
  })
}

function getLocation(locationURL) {
  if (!locationURL) return
  axios.get(locationURL).then(response => {
    createLocationHeader(response.data)
    createCharacters(response.data.residents)
  })
}

function createEpisodeHeader(episode) {
  $('main').empty()
  $('main').append(
    $('<article>', {
      class: 'content__header'
    }).append(
      $('<div>', {
        class: 'content__header__text'
      }).append(
        $('<span>', {
          class: 'content__header__title',
          text: episode.name
        }),
        $('<span>', {
          class: 'content__header__subtitle',
          text: [
            episode.air_date,
            episode.episode
          ].join(' | ')
        })
      )
    )
  )
}

function createCharacterHeader(character) {
  $('main').empty()
  $('main').append(
    $('<article>', {
      class: 'content__header'
    }).append(
      $('<div>', {
        class: 'content__header__img'
      }).append(
        $('<img>', {
          src: character.image
        })
      ),
      $('<div>', {
        class: 'content__header__text'
      }).append(
        $('<span>', {
          class: 'content__header__title',
          text: character.name
        }),
        $('<span>', {
          class: 'content__header__subtitle',
          text: [
            character.species,
            character.status,
            character.gender,
            character.origin.name
          ].join(' | ')
        })
      )
    )
  )
}

function createLocationHeader(location) {
  $('main').empty()
  $('main').append(
    $('<article>', {
      class: 'content__header'
    }).append(
      $('<div>', {
        class: 'content__header__text'
      }).append(
        $('<span>', {
          class: 'content__header__title',
          text: location.name
        }),
        $('<span>', {
          class: 'content__header__subtitle',
          text: [
            location.type,
            location.dimension
          ].join(' | ')
        })
      )
    )
  )
}

function createEpisodes(episodes) {
  axios.all(episodes.map(axios.get)).then(responses => {
    responses.forEach(response => createEpisode(response.data))
  })
}

function createCharacters(characters) {
  axios.all(characters.map(url => axios.get(url))).then(responses => {
    responses.forEach(response => createCharacter(response.data))
  })
}

function createCharacter(character) {
  $('main').append(
    $('<article>', {
      id: character.id,
      class: 'character'
    }).append(
      $('<div>', {
        class: 'character__img'
      }).append(
        $('<img>', {
          src: character.image
        })
      ),
      $('<div>', {
        class: 'character__content'
      }).append(
        $('<div>', { class: 'character__section' }).append(
          $('<a>', {
            class: 'character__name',
            text: character.name
          }).on('click', () => getCharacter(character.url)),
          $('<span>', {
            class: 'character__status',
            text: [
              character.status,
              character.species
            ].join(' | ')
          })
        ),
        $('<div>', { class: 'character__section' }).append(
          $('<span>', {
            class: 'character__text',
            text: 'Last known location:'
          }),
          $('<a>', {
            class: 'character__location',
            text: character.location.name
          }).on('click', () => getLocation(character.location.url))
        ),
        $('<div>', { class: 'character__section' }).append(
          $('<span>', {
            class: 'character__text',
            text: 'First seen in:'
          }),
          $('<a>', {
            class: 'character__location',
            text: character.origin.name
          }).on('click', () => getLocation(character.origin.url))
        )
      )
    )
  )
}

function createEpisode(episode) {
  $('main').append(
    $('<article>', {
      id: episode.id,
      class: 'episode'
    }).append(
      $('<span>', {
        class: 'episode__name',
        text: episode.name
      }),
      $('<span>', {
        class: 'episode__subtitle',
        text: episode.air_date
      }),
      $('<span>', {
        class: 'episode__subtitle',
        text: episode.episode
      })
    ).on('click', () => getEpisode(episode.url))
  )
}