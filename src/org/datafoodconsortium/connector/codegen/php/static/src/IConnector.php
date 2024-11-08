<?php

namespace DataFoodConsortium\Connector;

use \VirtualAssembly\Semantizer\Semantizer;
use \VirtualAssembly\Semantizer\Semanticable;

interface IConnector extends \SplSubject {

    public const EVENT_WILDCARD = "*";
    public const EVENT_EXPORT = "export";
    public const EVENT_IMPORT = "import";

    public function export(Array $objects): string;
    public function fetch(string $semanticId): Semanticable;
    public function import(string $data, string $baseUri): Array;
    public function getSemantizer(): Semantizer;

    public function attach(\SplObserver $observer, string $event = Connector::EVENT_WILDCARD): void;
    public function detach(\SplObserver $observer, string $event = Connector::EVENT_WILDCARD): void;
    public function notify(string $event = Connector::EVENT_WILDCARD, $data = null, ...$other): void;

}