import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getGame, getUserAchievements } from '../api/api-conn';
import { useAuth0 } from '@auth0/auth0-react';
import ClaimAchievementButton from '../components/bounded-components/claim-button';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardImgOverlay,
  CardLink,
  CardText,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import { UserCard } from '../components/Card';

const AppFrame = styled.div`
  min-height: 100vh;
`;

const Title = styled.div`
  display: flex;
  text-align: center;
  font-size: 75px;
  -webkit-text-stroke: 0.7px red;
  justify-content: space-evenly;

  @media screen and (max-width: 600px) {
    text-align: center;
    font-size: 75px;
    -webkit-text-stroke: 0.7px red;
  }
`;

function GameStub() {
  const history = useHistory();
  const [SelectedGame, setSelectedGame] = useState('');
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [UserAchievements, setUserAchievements] = useState([]);

  const decodeURL = () => {
    // retrieve the current url
    let url = window.location.href;
    const uriLength = url.length;
    // handle questionmark at end of URI
    if (url.charAt(uriLength - 1) === '?') {
      url = url.slice(0, uriLength - 1);
    }
    const urlParam = url.split('/');
    const uncleanGame = urlParam.pop();
    let GameTitle = uncleanGame;
    //handle multiple words in game title.
    if (uncleanGame.includes('%20')) {
      let splitGame = uncleanGame.split('%20');
      if (splitGame.length >= 2) {
        splitGame = splitGame.map((word) => {
          return word.charAt(0).toLocaleUpperCase() + word.slice(1);
        });
        GameTitle = splitGame.join(' ');
      }
      return GameTitle;
    } else {
      //capitalize first letter in potentially uncapitalized search
      GameTitle = GameTitle.charAt(0).toLocaleUpperCase() + GameTitle.slice(1);
    }
    return GameTitle;
  };

  useEffect(() => {
    async function fetchGame(gameName) {
      const game = await getGame(gameName);

      //handle if fetch didn't find a game
      if (game.length === 0 || game === undefined) {
        history.push('/gamenotfound');
      } else {
        //this avoids async actions taking place during reroute.
        setSelectedGame(game[0]);

        await CurrentUserGameAchievements(game[0]);
        return game;
      }
    }

    async function CurrentUserGameAchievements(game) {
      //get workable data from database..
      if (isAuthenticated === true) {
        // Auth0 function to get a token to be pass JWT check.
        const Token = await getAccessTokenSilently({
          scope: 'read:current_user',
        });
        if (game.id !== undefined) {
          const userData = await getUserAchievements(
            user.email,
            game.id,
            Token,
          );
          //set workable data
          console.log(userData);

          await setUserAchievements(userData);
        }
      }
    }

    async function LoadData() {
      const gameIS = decodeURL();
      fetchGame(gameIS);
    }

    LoadData();

    //game setting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AppFrame>
      <Title>
        {SelectedGame !== '' ? (
          <>
            {SelectedGame.name}
            {/* Hard coding total games and player achieved games for the present. Fix below/ */}
          </>
        ) : (
          <p>Loading game...</p>
        )}
      </Title>
      <Row>
        {SelectedGame !== ''
          ? SelectedGame.achievements.map((achiev) => {
              return (
                <Col key={achiev.name} md={6} sm={6} xs={12} className='mb-3'>
                  <Card
                    key={achiev.name}
                    className={`border-0 bg-gradient-theme`}
                  >
                    <CardBody>
                      <CardTitle> {achiev.name}</CardTitle>
                      Contributor: {achiev.contributor} &nbsp; &nbsp; &nbsp;
                      &nbsp; &nbsp; Difficulty: {achiev.difficulty}
                      {achiev.description}
                      {/* render claim button if the user is logged in. */}
                      {UserAchievements !== '' ? (
                        <>
                          {isAuthenticated && (
                            <ClaimAchievementButton
                              game={SelectedGame.id}
                              achievement={achiev}
                              userAchievements={UserAchievements}
                              passAchievements={setUserAchievements}
                            />
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </CardBody>
                    {isAuthenticated && (
                      <ClaimAchievementButton
                        game={SelectedGame.id}
                        achievement={achiev}
                        userAchievements={UserAchievements}
                        passAchievements={setUserAchievements}
                      />
                    )}
                  </Card>
                </Col>
              );
            })
          : null}
      </Row>
    </AppFrame>
  );
}

export default GameStub;
