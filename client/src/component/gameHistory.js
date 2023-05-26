import {useEffect, useState} from "react";
import fetcher, {REQUEST_TYPE} from "../util/fetcher";
import EndPoints from "../constant/endPoints";
import {useSelector} from "react-redux";
import clsx from "clsx";

export default function GameHistory() {
    const [gameHistories, setGameHistories] = useState([]);
    const {player, socket} = useSelector(state => state.playerReducer);

    useEffect(() => {
        (async () => {
            if(player?.id) {
                const {data, error} = await fetcher(EndPoints.GET_USER_SCORES_BY_USER_ID(player.id), REQUEST_TYPE.GET);

                if(!error) {
                    setGameHistories(data);
                }else {
                    alert("Bir hata meydana geldi.");
                }
            }
        })();
    }, [player?.id]);

    return (
        <div className="modal modal-lg fade" id="gameHistoryModal" tabIndex="-1" aria-labelledby="gameHistoryModal"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Oyun Geçmişim</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {(gameHistories.length > 0) ? (
                            <ul>
                                {gameHistories.map((gameHistory, index) => {
                                    return (
                                        <li key={index}>
                                            Skor: {gameHistory.score}, Oda: {gameHistory.game.room.roomName}, Toplam Skor: {gameHistory.game.totalScore}
                                            &nbsp;<a className="link-info" type="button" data-bs-toggle="collapse"
                                                    data-bs-target={`#userList${index}`} aria-expanded="false"
                                                    aria-controls="collapseExample">
                                                Oyuncular x{gameHistory.game.userScores.length}
                                            </a>
                                            <div className="collapse" id={`userList${index}`}>
                                                <div className="card card-body">
                                                    <ul>
                                                        {gameHistory.game.userScores.map((user, index) => {
                                                            return (
                                                                <li key={index}>{index + 1}-){user.user.nickName}, {user.user.email}, Skor: {user.score}</li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <p>Herhangi bir oyun geçmişi bulunamadı.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
