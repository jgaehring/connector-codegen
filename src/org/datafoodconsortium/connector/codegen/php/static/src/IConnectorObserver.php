<?php

namespace DataFoodConsortium\Connector;

interface IConnectorObserver extends \SplObserver {
    public function update(\SplSubject $connector, string $event = null, $json = null): void;
}
