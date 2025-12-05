CREATE TABLE CAMBIO(
	ID_CAMBIO SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(100)
);

create table DEPARTAMENTO(
	ID_DEPA SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(30)
);

CREATE TABLE ROL(
	ID_ROL SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(30)
);

CREATE TABLE ESTADO(
	ID_ESTADO SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(10)
);

CREATE TABLE PRIORIDAD(
	ID_PRIORIDAD SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(30)
);

CREATE TABLE USUARIO(
	RUT VARCHAR(10) PRIMARY KEY,
	NOMBRE VARCHAR(30),
	APELLIDO VARCHAR(30),
	CORREO VARCHAR(255),
	CONTRASENA TEXT,
	DEPARTAMENTO INT,
	ROL INT,
	FOREIGN KEY (DEPARTAMENTO) REFERENCES DEPARTAMENTO(ID_DEPA),
	FOREIGN KEY (ROL) REFERENCES ROL(ID_ROL)
);

CREATE TABLE SOLICITUD(
	NUMERO_SOLICITUD SERIAL PRIMARY KEY,
	FECHA_SOLICITUD DATE,
	HORA_SOLICITUD TIME,
	USUARIO VARCHAR(10),
	EJECUTOR VARCHAR(10),
	PRIORIDAD INT,
	CAMBIO INT,
	FOREIGN KEY (USUARIO) REFERENCES USUARIO(RUT),
	FOREIGN KEY (EJECUTOR) REFERENCES USUARIO(RUT),
	FOREIGN KEY (PRIORIDAD) REFERENCES PRIORIDAD(ID_PRIORIDAD),
	FOREIGN KEY (CAMBIO) REFERENCES CAMBIO(ID_CAMBIO)
);

CREATE TABLE HISTORIAL(
	NUMERO_REGISTRO SERIAL PRIMARY KEY,
	FECHA_REGISTRO DATE,
	HORA_REGISTRO TIME,
	SOLICITUD INT ,
	ESTADO INT,
	FOREIGN KEY (SOLICITUD) REFERENCES SOLICITUD(NUMERO_SOLICITUD) on delete cascade,
	FOREIGN KEY (ESTADO) REFERENCES ESTADO(ID_ESTADO)
);

CREATE TABLE INFORMACION(
	ID_INFORMACION SERIAL PRIMARY KEY,
	COMENTARIOS VARCHAR(500),
	ACTUAL VARCHAR(500),
	OBJETIVO VARCHAR(500),
	OTROS VARCHAR(500),
	SISTEMA VARCHAR(50),
	SUB_SISTEMA VARCHAR(50),
	SECTOR VARCHAR(50)
);

CREATE TABLE SOLICITUD_INFORMACION(
	SOLICITUD INT,
	INFORMACION INT,
	PRIMARY KEY (SOLICITUD, INFORMACION),
	FOREIGN KEY (SOLICITUD) REFERENCES SOLICITUD(NUMERO_SOLICITUD),
	FOREIGN KEY (INFORMACION) REFERENCES INFORMACION(ID_INFORMACION)
);

ALTER TABLE SOLICITUD
ALTER COLUMN FECHA_SOLICITUD SET DEFAULT CURRENT_DATE,
ALTER COLUMN HORA_SOLICITUD SET DEFAULT CURRENT_TIME;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'solicitud';

INSERT INTO ROL (nombre) 
VALUES ('solicitante'), ('ejecutor'), ('administrador');

INSERT INTO ESTADO (NOMBRE)
VALUES ('Finalizado'), ('Ejecutando'),('En espera'),('Recibido');

INSERT INTO PRIORIDAD (NOMBRE)
VALUES ('Baja'), ('Mediana'), ('Alta'), ('Urgente');

--alteración de la tabla principal y creación de tablas extra para almacenar información de las solicitudes

CREATE TABLE JERARQUIA(
	ID_JERARQUIA SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(100),
	TIPO VARCHAR(100),
	ID_PADRE INT,
	FOREIGN KEY (ID_PADRE) REFERENCES JERARQUIA(ID_JERARQUIA)
);

ALTER TABLE informacion
DROP COLUMN SISTEMA,
DROP COLUMN SUB_SISTEMA,
DROP COLUMN SECTOR;

ALTER TABLE INFORMACION
ADD COLUMN JERARQUIA int;

ALTER TABLE INFORMACION
ADD CONSTRAINT FK_JERARQUIA 
FOREIGN KEY (JERARQUIA) REFERENCES JERARQUIA(ID_JERARQUIA);

select * from usuario;

select * from departamento;

insert into departamento(nombre)
values ('TI'),('RRHH'),('Contabilidad');

SELECT  us.rut, us.correo, depa.nombre, rol.nombre
FROM usuario as us
JOIN DEPARTAMENTO AS depa ON depa.ID_DEPA = us.departamento
join rol on rol.id_rol = us.rol;

select * from prioridad;

insert into cambio (nombre)
values ('Nuevo Motivo'),('cambiar usuario de sector'), ('cambiar precio de un producto');

--insersión de datos en jerarquia.

insert into jerarquia (nombre, tipo)
values ('SAP','Sistema'), ('ACES','Sistema');

insert into jerarquia (nombre, tipo, id_padre)
values ('USUARIO','SubSistema',1),('ARTICULO','SubSistema',1),('SN','SubSistema',1);

insert into jerarquia (nombre, tipo, id_padre)
values ('Propietario','Sector',3),('Sector Ventas','Sector',3);

insert into jerarquia (nombre, tipo, id_padre)
values ('Rut','Atributo',6),('Nombre','Atributo',6),('Sector','Atributo',6);

select * from jerarquia;

--eliminación de la tabla información y tablas intermedias y mover los atributos a solicitud

drop table solicitud_informacion;

drop table informacion;

alter table solicitud 
add column comentarios varchar(500),
add column actual varchar(50),
add column objetivo varchar(50),
add column id_jerarquia int;

alter table solicitud
add constraint fk_jerarquia
foreign key (id_jerarquia) references jerarquia(id_jerarquia);

--Arreglo de datos mal insertados en jerarquia

select * from jerarquia;

update jerarquia 
set tipo = 'Sector' 
where tipo ='Sector Ventas';

update jerarquia 
set id_padre = 5
where id_padre = 3;

select * from solicitud;
select * from usuario;

alter table solicitud
drop column objetivo, 
drop column actual;

truncate table solicitud restart identity cascade;

delete from usuario
where nombre = 'Joaquin';

select * from historial;
select * from estado;

insert into estado (nombre)
values ('Rechazado');

select s.numero_solicitud as solicitud, s.fecha_solicitud as fecha, u.nombre ||''|| u.apellido as nombre, p.nombre as prioridad,c.nombre as prioridad,s.comentarios as descripcion,j.nombre as sistema,e.nombre as estado
from solicitud as s
join usuario as u on u.rut = s.usuario
join prioridad as p on p.id_prioridad = s.prioridad
join cambio as c on c.id_cambio = s.cambio
join jerarquia as j on j.id_jerarquia = s.id_jerarquia
join historial as h on s.numero_solicitud = h.solicitud
join estado as e on h.estado = e.id_estado
where s.numero_solicitud = 1;

select * from prioridad;
