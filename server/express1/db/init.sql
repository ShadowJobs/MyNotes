CREATE DATABASE IF NOT EXISTS antdp1use;
USE antdp1use;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    phone VARCHAR(20),
    gender CHAR(1),
    PRIMARY KEY (id)
);

INSERT INTO user (name, phone, gender,ip) VALUES ('linying0', '15822223331', 'F','1.1.1.1'), ('ziye', '15888888888', 'M','1.2.2.1');
INSERT INTO user (name, phone, gender) VALUES ('ly2', '15822223331', 'F','1.1.1.2');
delete from user where name='ly2';
alter table user add column token varchar(255) not null default '' comment 'token';
alter table user add column token_up_time datetime comment 'token更新时间';
alter table user add column token_expire_time datetime comment 'token过期时间';
alter table user add column login_status tinyint not null default 0 comment '登录状态';
alter table user add column psw varchar(255) not null default '' comment '密码';
alter table user add column psw_update_time datetime not null default '1970-01-01 00:00:00' comment '密码更新时间';
alter table user add column psw_expire_time datetime not null default '1970-01-01 00:00:00' comment '密码过期时间';
alter table user add column psw_error_times int not null default 0 comment '密码错误次数';
alter table user add column psw_lock_time int comment '密码锁定时间(秒)';
alter table user add column psw_lock_status tinyint not null default 0 comment '密码锁定状态';
-- 删除列login_status
alter table user drop column login_status;
alter table user add column login_time datetime comment '登录时间';
insert into user (name,phone,gender,token,token_up_time,token_expire_time,psw,psw_update_time,psw_expire_time,psw_error_times,psw_lock_time,psw_lock_status,login_time,ip)
values('linying', '15822223331', 'F', 'token', '2020-01-01 00:00:00', '2020-01-01 00:00:00', 'password', '2020-01-01 00:00:00', '2020-01-01 00:00:00', 0, 0, 0, '2020-01-01 00:00:00','1.2.1.2');
update user set name='ly1' where name='linying0';
ALTER TABLE user ADD UNIQUE (name);
alter table user add COLUMN ip varchar(30) not null default '' comment 'ip';
UPDATE user SET ip = name;
ALTER TABLE user ADD UNIQUE (ip);



-- execute in shell： mysql -u yourusername -p -h localhost < init.sql

