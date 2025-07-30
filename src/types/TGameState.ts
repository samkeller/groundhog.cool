import { Container } from "pixi.js";
import Player from "../game/Player";
import { TMap } from "./TMap";
import Tickable from "../game/entities/types/Tickable";

export default interface TGameState {
  // Tickables (Burrow, Groundhog...) : entités qui doivent être mises à jour
  tickers: Tickable[];

  // Toutes les entités présentes dans le monde (y compris décoratives ou statiques)
  // entities: Entity[]; // ou `Record<string, Entity>` si tu veux des ID

  // Carte du monde (grille, colliders, type de terrain…)
  map: TMap;

  /**
   * Référence au joueur principal ou aux joueurs
   */
  player: Player;

  /**
   * Scène graphique (Pixi)
   */
  container: Container;

  // Historique des événements (facultatif)
  // eventLog?: GameEvent[];

  // Services utiles au moteur et aux entités
  // services?: {
  //   collision: CollisionService;
  //   spawn: SpawnService;
  //   perception: PerceptionService;
  // };
}
